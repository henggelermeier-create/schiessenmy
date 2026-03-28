# mySwissTarget.ch – Verkaufswebseite mit Admin-CMS-Demo

Diese Version enthält:
- Verkaufswebseite im bisherigen Premium-Stil
- Bestellformular mit Probeabo / Rechnung / TWINT / Karte
- Kundenbereich-Demo unter `public/kundenbereich.html`
- Admin-CMS-Demo unter `public/adminbereich.html`
- Bearbeitung von Hero, Modulen, Vergleich, Disziplinen, Preisen, FAQ und Footer direkt im Browser
- Export / Import der Website-Inhalte als JSON

## Coolify
- Build Pack: Dockerfile
- Base Directory: /
- Dockerfile Location: /Dockerfile
- Domain: https://myswisstarget.ch
- Healthcheck: /health

## Hinweis zur Admin-Demo
Die Änderungen aus dem Adminbereich werden browserseitig in `localStorage` gespeichert.
Für den Live-Betrieb kann diese Struktur später direkt an ein echtes Backend angebunden werden.

## Live-Anbindung Bestellformular
Die Live-Endpunkte werden in `public/config.js` hinterlegt:
- `orderApiUrl`
- `invoiceApiUrl`
- `checkoutApiUrl`
- `twintCheckoutUrl`
- `cardCheckoutUrl`
