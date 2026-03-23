# SwissTarget Stripe FastAPI Integration

Dieses Paket ist als **GitHub-/Coolify-taugliche Einbauhilfe** für eure bestehende SwissTarget-App gedacht.

Enthalten:
- Stripe Billing Endpunkte für Karte / Rechnung
- Webhook-Handler für Freischaltung
- SQLAlchemy-Modelle für `customers`, `subscriptions`, `payments`
- Alembic-Migration
- `.env.example`
- Hinweise für GitHub/Coolify

## Enthaltene Endpunkte
- `POST /api/v1/billing/config`
- `POST /api/v1/billing/checkout-session`
- `POST /api/v1/billing/invoice-subscription`
- `POST /api/v1/billing/customer-portal`
- `POST /api/v1/billing/webhook`

## Stripe-Logik
- Basis: CHF 25 / Monat
- Pro: + CHF 10 / Monat
- 30 Tage Trial
- Karte für automatisches Abo
- Rechnung per Stripe Billing / `send_invoice`
- TWINT ist in Stripe grundsätzlich möglich, für automatische Monatsabos aber nicht die beste Standardmethode

## Einbau in eure App
1. Dateien in eure bestehende App-Struktur kopieren.
2. `.env.example` nach `.env` übernehmen und echte Werte setzen.
3. `requirements-additions.txt` in eure Requirements übernehmen.
4. Alembic Migration einspielen.
5. `app/api/router_registration_example.py` in eurer `main.py` bzw. API-Registrierung übernehmen.
6. In `provision_tenant_and_admin()` eure echte Vereins-/Mandantenlogik einbauen.

## GitHub / Coolify
Für Coolify braucht ihr zusätzlich:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_BASIS`
- `STRIPE_PRICE_PRO`
- `APP_BASE_URL`
- `APP_SUCCESS_URL`
- `APP_CANCEL_URL`
- `DATABASE_URL`

## Wichtiger Hinweis
Diese ZIP ist **ein Integrationspaket**, keine komplette neue App. Sie ist dafür gedacht, in euer bestehendes FastAPI-Projekt übernommen zu werden.
