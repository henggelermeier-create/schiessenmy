# myswisstarget.ch – bereinigte Coolify-Version

Diese Version ist für **GitHub → Coolify Deployments** einer **statischen Verkaufswebseite** gedacht.

## Enthalten

- `docker-compose.yml` mit nur **einem** Service
- `Dockerfile` für einen schlanken Nginx-Container
- `nginx.conf` mit SPA-Fallback und `/health`
- `public/` mit der statischen Webseite

## Empfohlene Coolify-Einstellungen

### Build / Source
- Source: Git Repository
- Build Pack: **Docker Compose**
- Compose-Datei: `docker-compose.yml`

### Domain / Port
- Domain: `https://myswisstarget.ch`
- Exposed Port in Coolify: `80`
- **Kein** Host-Port-Mapping wie `80:80`

## Wichtige Hinweise

1. Wenn der Build fehlschlägt, liegt es meistens an einer falschen Build-Pack-Auswahl in Coolify.
2. Wenn der Container läuft, aber im Browser `404 page not found` erscheint, liegt es meist an der **Domain-/Proxy-Zuordnung in Coolify**, nicht am Container.
3. Wenn die Domain zwar aufgelöst wird, aber nichts angezeigt wird, zusätzlich DNS prüfen:
   - `A` Record für `@` → Server-IP
   - optional `CNAME` für `www` → Root-Domain

## Was bereinigt wurde

- Compose bewusst minimal gehalten
- Healthcheck ergänzt
- Dockerfile robuster gemacht
- unnötige Komplexität entfernt

## Lokaler Test

```bash
docker compose up --build
```

Danach sollte die Seite auf dem veröffentlichten Port erreichbar sein und `/health` mit `ok` antworten.
