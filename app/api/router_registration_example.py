# Beispiel für eure main.py oder zentrale API-Registrierung

from app.api.billing import router as billing_router
from app.api.billing_webhook import router as billing_webhook_router

# app.include_router(billing_router)
# app.include_router(billing_webhook_router)
