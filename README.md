# mySwissTarget.ch – Premium Website mit Bestellformular

Diese Version enthält:
- Verkaufswebseite für mySwissTarget.ch
- Bestellformular unter `public/bestellung.html`
- Admin-Demo unter `public/adminbereich.html`
- Nginx / Dockerfile für Coolify

## Coolify
- Build Pack: Dockerfile
- Base Directory: /
- Dockerfile Location: /Dockerfile
- Domain: https://myswisstarget.ch
- Healthcheck: /health

## Bestellformular
Das Bestellformular ist frontend-seitig vollständig eingebaut und rechnet:
- 1 Monat Probeabo
- Basis CHF 25 / Monat
- Basis + Pro CHF 35 / Monat
- Rechnung, TWINT oder Karte

### Live-Anbindung
Die Live-Endpunkte werden in `public/config.js` hinterlegt:
- `orderApiUrl`
- `invoiceApiUrl`
- `checkoutApiUrl`
- `twintCheckoutUrl`
- `cardCheckoutUrl`

### Erwartetes JSON an das Backend
```json
{
  "plan": "basis" | "basis_pro",
  "club_name": "...",
  "contact_name": "...",
  "email": "...",
  "phone": "...",
  "street": "...",
  "zip_city": "...",
  "payment_method": "invoice" | "twint" | "card",
  "trial_months": "1",
  "notes": "...",
  "accept_trial": true,
  "accept_terms": true,
  "monthly_price_chf": 25 | 35
}
```

### Erwartete Antwort
Für Rechnung genügt z. B.:
```json
{
  "message": "Bestellung erhalten. Probeabo aktiviert.",
  "order_id": "SW-1001"
}
```

Für TWINT oder Karte kann das Backend zusätzlich liefern:
```json
{
  "checkout_url": "https://checkout.example.com/session/..."
}
```
Dann leitet das Formular automatisch weiter.


Logo-Assets:
- public/assets/logo-nav.png
- public/assets/logo-full-slogan.png
- public/assets/logo-mark.png
- public/assets/favicon.ico
