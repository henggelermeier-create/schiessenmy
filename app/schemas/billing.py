from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr


class CheckoutSessionRequest(BaseModel):
    verein_name: str
    contact_name: str
    email: EmailStr
    phone: str | None = None
    pro_paket: bool = False


class InvoiceSubscriptionRequest(BaseModel):
    verein_name: str
    contact_name: str
    email: EmailStr
    phone: str | None = None
    pro_paket: bool = False
    payment_terms_days: int = 14


class CustomerPortalRequest(BaseModel):
    stripe_customer_id: str


class SubscriptionOut(BaseModel):
    id: str
    plan_name: str
    payment_method_type: str
    status: str
    trial_ends_at: datetime | None = None
    current_period_end: datetime | None = None


class PaymentOut(BaseModel):
    id: str
    amount_chf: float
    currency: str
    payment_method_type: str
    status: str
    paid_at: datetime | None = None
