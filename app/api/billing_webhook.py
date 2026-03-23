from __future__ import annotations

import os
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.billing import Customer, Payment, PaymentMethodType, PaymentStatus, Subscription, SubscriptionPlan, SubscriptionStatus

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])


def ts_to_dt(value: int | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromtimestamp(value, tz=timezone.utc)


def amount_cents_to_chf(amount: int | None) -> Decimal:
    if amount is None:
        return Decimal("0.00")
    return (Decimal(amount) / Decimal("100")).quantize(Decimal("0.01"))


def plan_from_metadata(metadata: dict[str, Any] | None) -> SubscriptionPlan:
    metadata = metadata or {}
    pro_enabled = str(metadata.get("pro_paket", "false")).lower() == "true"
    return SubscriptionPlan.BASIS_PRO if pro_enabled else SubscriptionPlan.BASIS


def status_from_stripe_status(status: str | None) -> SubscriptionStatus:
    if status == "trialing":
        return SubscriptionStatus.TRIALING
    if status == "active":
        return SubscriptionStatus.ACTIVE
    if status == "past_due":
        return SubscriptionStatus.PAST_DUE
    if status in {"canceled", "cancelled"}:
        return SubscriptionStatus.CANCELLED
    return SubscriptionStatus.PENDING_PAYMENT


def get_customer_by_stripe_id(db: Session, stripe_customer_id: str | None) -> Customer | None:
    if not stripe_customer_id:
        return None
    stmt = select(Customer).where(Customer.stripe_customer_id == stripe_customer_id)
    return db.execute(stmt).scalar_one_or_none()


def get_subscription_by_stripe_id(db: Session, stripe_subscription_id: str | None) -> Subscription | None:
    if not stripe_subscription_id:
        return None
    stmt = select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id)
    return db.execute(stmt).scalar_one_or_none()


def get_subscription_by_checkout_session_id(db: Session, stripe_checkout_session_id: str | None) -> Subscription | None:
    if not stripe_checkout_session_id:
        return None
    stmt = select(Subscription).where(Subscription.stripe_checkout_session_id == stripe_checkout_session_id)
    return db.execute(stmt).scalar_one_or_none()


def get_payment_by_invoice_id(db: Session, stripe_invoice_id: str | None) -> Payment | None:
    if not stripe_invoice_id:
        return None
    stmt = select(Payment).where(Payment.stripe_invoice_id == stripe_invoice_id)
    return db.execute(stmt).scalar_one_or_none()


def ensure_customer(
    db: Session,
    *,
    stripe_customer_id: str | None,
    email: str | None,
    contact_name: str | None,
    verein_name: str | None,
    phone: str | None = None,
) -> Customer:
    existing = get_customer_by_stripe_id(db, stripe_customer_id)
    if existing:
        if email and existing.email != email:
            existing.email = email
        if contact_name and existing.contact_name != contact_name:
            existing.contact_name = contact_name
        if verein_name and existing.verein_name != verein_name:
            existing.verein_name = verein_name
        if phone and existing.phone != phone:
            existing.phone = phone
        return existing

    customer = Customer(
        stripe_customer_id=stripe_customer_id,
        email=email or "unknown@example.invalid",
        contact_name=contact_name or "Unbekannt",
        verein_name=verein_name or "Unbekannter Verein",
        phone=phone,
        country="CH",
        is_provisioned=False,
    )
    db.add(customer)
    db.flush()
    return customer


def ensure_subscription(
    db: Session,
    *,
    customer_id,
    stripe_subscription_id: str | None,
    stripe_checkout_session_id: str | None,
    plan_name: SubscriptionPlan,
    payment_method_type: PaymentMethodType,
    status: SubscriptionStatus,
    trial_ends_at: datetime | None,
    current_period_start: datetime | None,
    current_period_end: datetime | None,
) -> Subscription:
    sub = get_subscription_by_stripe_id(db, stripe_subscription_id)
    if not sub and stripe_checkout_session_id:
        sub = get_subscription_by_checkout_session_id(db, stripe_checkout_session_id)

    if sub:
        sub.customer_id = customer_id
        sub.plan_name = plan_name
        sub.payment_method_type = payment_method_type
        sub.status = status
        sub.stripe_subscription_id = stripe_subscription_id
        if stripe_checkout_session_id:
            sub.stripe_checkout_session_id = stripe_checkout_session_id
        sub.trial_ends_at = trial_ends_at
        sub.current_period_start = current_period_start
        sub.current_period_end = current_period_end
        sub.amount_basis_chf = 25
        sub.amount_pro_chf = 10 if plan_name == SubscriptionPlan.BASIS_PRO else 0
        return sub

    sub = Subscription(
        customer_id=customer_id,
        stripe_subscription_id=stripe_subscription_id,
        stripe_checkout_session_id=stripe_checkout_session_id,
        plan_name=plan_name,
        payment_method_type=payment_method_type,
        status=status,
        trial_ends_at=trial_ends_at,
        current_period_start=current_period_start,
        current_period_end=current_period_end,
        amount_basis_chf=25,
        amount_pro_chf=10 if plan_name == SubscriptionPlan.BASIS_PRO else 0,
    )
    db.add(sub)
    db.flush()
    return sub


def ensure_payment(
    db: Session,
    *,
    customer_id,
    subscription_id,
    stripe_invoice_id: str | None,
    stripe_payment_intent_id: str | None,
    amount_chf: Decimal,
    payment_method_type: PaymentMethodType,
    status: PaymentStatus,
    description: str | None = None,
    due_date: datetime | None = None,
    paid_at: datetime | None = None,
) -> Payment:
    payment = get_payment_by_invoice_id(db, stripe_invoice_id)
    if payment:
        payment.subscription_id = subscription_id
        payment.stripe_payment_intent_id = stripe_payment_intent_id
        payment.amount_chf = amount_chf
        payment.payment_method_type = payment_method_type
        payment.status = status
        payment.description = description
        payment.due_date = due_date
        payment.paid_at = paid_at
        return payment

    payment = Payment(
        customer_id=customer_id,
        subscription_id=subscription_id,
        stripe_invoice_id=stripe_invoice_id,
        stripe_payment_intent_id=stripe_payment_intent_id,
        amount_chf=amount_chf,
        currency="CHF",
        payment_method_type=payment_method_type,
        status=status,
        description=description,
        due_date=due_date,
        paid_at=paid_at,
    )
    db.add(payment)
    db.flush()
    return payment


def provision_tenant_and_admin(db: Session, customer: Customer) -> None:
    # TODO: Hier eure echte Vereins-/Mandanten- und Admin-Erstellung einbauen.
    if not customer.is_provisioned:
        customer.is_provisioned = True


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: str = Header(alias="Stripe-Signature"),
) -> dict:
    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(payload=payload, sig_header=stripe_signature, secret=WEBHOOK_SECRET)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid payload") from exc
    except stripe.error.SignatureVerificationError as exc:
        raise HTTPException(status_code=400, detail="Invalid signature") from exc

    event_type = event["type"]
    data = event["data"]["object"]

    try:
        if event_type == "checkout.session.completed":
            await handle_checkout_session_completed(db, data)
        elif event_type == "invoice.paid":
            await handle_invoice_paid(db, data)
        elif event_type == "invoice.payment_failed":
            await handle_invoice_payment_failed(db, data)
        elif event_type == "customer.subscription.updated":
            await handle_subscription_updated(db, data)
        elif event_type == "customer.subscription.deleted":
            await handle_subscription_deleted(db, data)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {"received": True, "event_type": event_type}


async def handle_checkout_session_completed(db: Session, session_obj: dict[str, Any]) -> None:
    stripe_customer_id = session_obj.get("customer")
    stripe_subscription_id = session_obj.get("subscription")
    stripe_checkout_session_id = session_obj.get("id")
    customer_details = session_obj.get("customer_details") or {}
    metadata = session_obj.get("metadata") or {}

    customer = ensure_customer(
        db,
        stripe_customer_id=stripe_customer_id,
        email=customer_details.get("email"),
        contact_name=customer_details.get("name") or metadata.get("contact_name"),
        verein_name=metadata.get("verein_name"),
        phone=customer_details.get("phone"),
    )

    if stripe_subscription_id:
        stripe_sub = stripe.Subscription.retrieve(stripe_subscription_id)
        subscription = ensure_subscription(
            db,
            customer_id=customer.id,
            stripe_subscription_id=stripe_subscription_id,
            stripe_checkout_session_id=stripe_checkout_session_id,
            plan_name=plan_from_metadata(stripe_sub.get("metadata")),
            payment_method_type=PaymentMethodType.CARD,
            status=status_from_stripe_status(stripe_sub.get("status")),
            trial_ends_at=ts_to_dt(stripe_sub.get("trial_end")),
            current_period_start=ts_to_dt(stripe_sub.get("current_period_start")),
            current_period_end=ts_to_dt(stripe_sub.get("current_period_end")),
        )
        if subscription.status in {SubscriptionStatus.TRIALING, SubscriptionStatus.ACTIVE}:
            provision_tenant_and_admin(db, customer)
            customer.is_provisioned = True


async def handle_invoice_paid(db: Session, invoice_obj: dict[str, Any]) -> None:
    stripe_customer_id = invoice_obj.get("customer")
    stripe_subscription_id = invoice_obj.get("subscription")
    stripe_invoice_id = invoice_obj.get("id")
    stripe_payment_intent_id = invoice_obj.get("payment_intent")

    customer = get_customer_by_stripe_id(db, stripe_customer_id)
    if not customer:
        customer = ensure_customer(db, stripe_customer_id=stripe_customer_id, email=None, contact_name=None, verein_name=None)

    subscription = get_subscription_by_stripe_id(db, stripe_subscription_id)
    if subscription:
        subscription.status = SubscriptionStatus.ACTIVE

    payment_method_type = PaymentMethodType.INVOICE if invoice_obj.get("collection_method") == "send_invoice" else PaymentMethodType.CARD
    ensure_payment(
        db,
        customer_id=customer.id,
        subscription_id=subscription.id if subscription else None,
        stripe_invoice_id=stripe_invoice_id,
        stripe_payment_intent_id=stripe_payment_intent_id,
        amount_chf=amount_cents_to_chf(invoice_obj.get("amount_paid")),
        payment_method_type=payment_method_type,
        status=PaymentStatus.PAID,
        description="Stripe invoice paid",
        due_date=ts_to_dt(invoice_obj.get("due_date")),
        paid_at=ts_to_dt((invoice_obj.get("status_transitions") or {}).get("paid_at")) or datetime.now(timezone.utc),
    )

    provision_tenant_and_admin(db, customer)
    customer.is_provisioned = True


async def handle_invoice_payment_failed(db: Session, invoice_obj: dict[str, Any]) -> None:
    stripe_customer_id = invoice_obj.get("customer")
    stripe_subscription_id = invoice_obj.get("subscription")
    stripe_invoice_id = invoice_obj.get("id")
    stripe_payment_intent_id = invoice_obj.get("payment_intent")

    customer = get_customer_by_stripe_id(db, stripe_customer_id)
    if not customer:
        customer = ensure_customer(db, stripe_customer_id=stripe_customer_id, email=None, contact_name=None, verein_name=None)

    subscription = get_subscription_by_stripe_id(db, stripe_subscription_id)
    if subscription:
        subscription.status = SubscriptionStatus.PAST_DUE

    payment_method_type = PaymentMethodType.INVOICE if invoice_obj.get("collection_method") == "send_invoice" else PaymentMethodType.CARD
    ensure_payment(
        db,
        customer_id=customer.id,
        subscription_id=subscription.id if subscription else None,
        stripe_invoice_id=stripe_invoice_id,
        stripe_payment_intent_id=stripe_payment_intent_id,
        amount_chf=amount_cents_to_chf(invoice_obj.get("amount_due")),
        payment_method_type=payment_method_type,
        status=PaymentStatus.FAILED,
        description="Stripe invoice payment failed",
        due_date=ts_to_dt(invoice_obj.get("due_date")),
    )


async def handle_subscription_updated(db: Session, subscription_obj: dict[str, Any]) -> None:
    stripe_subscription_id = subscription_obj.get("id")
    stripe_customer_id = subscription_obj.get("customer")
    metadata = subscription_obj.get("metadata") or {}

    customer = get_customer_by_stripe_id(db, stripe_customer_id)
    if not customer:
        customer = ensure_customer(db, stripe_customer_id=stripe_customer_id, email=None, contact_name=None, verein_name=metadata.get("verein_name"))

    subscription = ensure_subscription(
        db,
        customer_id=customer.id,
        stripe_subscription_id=stripe_subscription_id,
        stripe_checkout_session_id=None,
        plan_name=plan_from_metadata(metadata),
        payment_method_type=PaymentMethodType.INVOICE if subscription_obj.get("collection_method") == "send_invoice" else PaymentMethodType.CARD,
        status=status_from_stripe_status(subscription_obj.get("status")),
        trial_ends_at=ts_to_dt(subscription_obj.get("trial_end")),
        current_period_start=ts_to_dt(subscription_obj.get("current_period_start")),
        current_period_end=ts_to_dt(subscription_obj.get("current_period_end")),
    )

    if subscription.status in {SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING}:
        provision_tenant_and_admin(db, customer)
        customer.is_provisioned = True


async def handle_subscription_deleted(db: Session, subscription_obj: dict[str, Any]) -> None:
    stripe_subscription_id = subscription_obj.get("id")
    subscription = get_subscription_by_stripe_id(db, stripe_subscription_id)
    if not subscription:
        return
    subscription.status = SubscriptionStatus.CANCELLED
    subscription.cancelled_at = datetime.now(timezone.utc)
