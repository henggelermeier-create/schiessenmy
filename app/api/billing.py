from __future__ import annotations

import os

import stripe
from fastapi import APIRouter

from app.schemas.billing import CheckoutSessionRequest, CustomerPortalRequest, InvoiceSubscriptionRequest

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])

PRICE_BASIS = os.environ["STRIPE_PRICE_BASIS"]
PRICE_PRO = os.environ["STRIPE_PRICE_PRO"]
PUBLISHABLE_KEY = os.environ["STRIPE_PUBLISHABLE_KEY"]
SUCCESS_URL = os.environ["APP_SUCCESS_URL"]
CANCEL_URL = os.environ["APP_CANCEL_URL"]
APP_BASE_URL = os.environ["APP_BASE_URL"]


@router.get("/config")
def get_config() -> dict:
    return {
        "publishableKey": PUBLISHABLE_KEY,
        "prices": {"basis_monthly": 25, "pro_monthly": 10},
        "trial_days": 30,
    }


@router.post("/checkout-session")
def create_checkout_session(payload: CheckoutSessionRequest) -> dict:
    line_items = [{"price": PRICE_BASIS, "quantity": 1}]
    if payload.pro_paket:
        line_items.append({"price": PRICE_PRO, "quantity": 1})

    customer = stripe.Customer.create(
        email=payload.email,
        name=payload.contact_name,
        phone=payload.phone,
        metadata={
            "verein_name": payload.verein_name,
            "contact_name": payload.contact_name,
            "pro_paket": str(payload.pro_paket).lower(),
        },
    )

    session = stripe.checkout.Session.create(
        mode="subscription",
        customer=customer.id,
        line_items=line_items,
        success_url=f"{SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=CANCEL_URL,
        payment_method_types=["card"],
        metadata={
            "verein_name": payload.verein_name,
            "contact_name": payload.contact_name,
            "pro_paket": str(payload.pro_paket).lower(),
            "source": "website-checkout",
        },
        subscription_data={
            "trial_period_days": 30,
            "metadata": {
                "verein_name": payload.verein_name,
                "contact_name": payload.contact_name,
                "pro_paket": str(payload.pro_paket).lower(),
                "source": "website-checkout",
            },
        },
    )
    return {"checkout_url": session.url, "session_id": session.id}


@router.post("/invoice-subscription")
def create_invoice_subscription(payload: InvoiceSubscriptionRequest) -> dict:
    customer = stripe.Customer.create(
        email=payload.email,
        name=payload.contact_name,
        phone=payload.phone,
        metadata={
            "verein_name": payload.verein_name,
            "contact_name": payload.contact_name,
            "pro_paket": str(payload.pro_paket).lower(),
            "source": "website-invoice",
        },
    )

    items = [{"price": PRICE_BASIS}]
    if payload.pro_paket:
        items.append({"price": PRICE_PRO})

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=items,
        trial_period_days=30,
        collection_method="send_invoice",
        days_until_due=payload.payment_terms_days,
        metadata={
            "verein_name": payload.verein_name,
            "contact_name": payload.contact_name,
            "pro_paket": str(payload.pro_paket).lower(),
            "source": "website-invoice",
        },
    )

    return {
        "subscription_id": subscription.id,
        "stripe_customer_id": customer.id,
        "status": subscription.status,
    }


@router.post("/customer-portal")
def create_customer_portal(payload: CustomerPortalRequest) -> dict:
    session = stripe.billing_portal.Session.create(
        customer=payload.stripe_customer_id,
        return_url=APP_BASE_URL,
    )
    return {"url": session.url}
