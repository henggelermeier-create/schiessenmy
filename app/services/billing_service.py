from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.billing import Customer, Payment, PaymentMethodType, PaymentStatus, Subscription, SubscriptionPlan, SubscriptionStatus


def create_customer(
    db: Session,
    *,
    verein_name: str,
    contact_name: str,
    email: str,
    phone: str | None = None,
    stripe_customer_id: str | None = None,
) -> Customer:
    customer = Customer(
        verein_name=verein_name,
        contact_name=contact_name,
        email=email,
        phone=phone,
        stripe_customer_id=stripe_customer_id,
    )
    db.add(customer)
    db.flush()
    return customer


def create_subscription(
    db: Session,
    *,
    customer_id,
    plan_name: SubscriptionPlan,
    payment_method_type: PaymentMethodType,
    status: SubscriptionStatus,
    stripe_subscription_id: str | None = None,
    stripe_checkout_session_id: str | None = None,
    trial_ends_at: datetime | None = None,
    current_period_start: datetime | None = None,
    current_period_end: datetime | None = None,
) -> Subscription:
    amount_basis = 25
    amount_pro = 10 if plan_name == SubscriptionPlan.BASIS_PRO else 0

    sub = Subscription(
        customer_id=customer_id,
        plan_name=plan_name,
        payment_method_type=payment_method_type,
        status=status,
        stripe_subscription_id=stripe_subscription_id,
        stripe_checkout_session_id=stripe_checkout_session_id,
        trial_ends_at=trial_ends_at,
        current_period_start=current_period_start,
        current_period_end=current_period_end,
        amount_basis_chf=amount_basis,
        amount_pro_chf=amount_pro,
    )
    db.add(sub)
    db.flush()
    return sub


def create_payment(
    db: Session,
    *,
    customer_id,
    subscription_id,
    amount_chf: float,
    payment_method_type: PaymentMethodType,
    status: PaymentStatus,
    stripe_invoice_id: str | None = None,
    stripe_payment_intent_id: str | None = None,
    due_date: datetime | None = None,
    description: str | None = None,
) -> Payment:
    payment = Payment(
        customer_id=customer_id,
        subscription_id=subscription_id,
        amount_chf=amount_chf,
        currency="CHF",
        payment_method_type=payment_method_type,
        status=status,
        stripe_invoice_id=stripe_invoice_id,
        stripe_payment_intent_id=stripe_payment_intent_id,
        due_date=due_date,
        description=description,
        paid_at=datetime.now(timezone.utc) if status == PaymentStatus.PAID else None,
    )
    db.add(payment)
    db.flush()
    return payment
