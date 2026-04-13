# Pernulo E-Commerce - Deployment Runbook

## Architecture Overview

Three systemd user services run on `bookhouse`, chained in startup order:

```
pernulo_api (Flask/Gunicorn :8540)
pernulo_frontend (React/serve :8541)
  └─ pernulo_tunnel (Cloudflare Tunnel, depends on both)
```

| Component | Port | Process | Public URL |
|-----------|------|---------|------------|
| Flask API | 8540 | gunicorn (2 workers) | https://pernulo-api.ftdalpha.com |
| React Frontend | 8541 | serve (static build) | https://pernulo.ftdalpha.com |
| Cloudflare Tunnel | -- | cloudflared | Routes both hostnames above |

All services bind to `127.0.0.1`. External access is exclusively through the Cloudflare Tunnel.

## Key Paths

| What | Path |
|------|------|
| Project root | `/home/bookworm/code/e-commerce-pernulo/` |
| API source | `/home/bookworm/code/e-commerce-pernulo/api/` |
| Frontend source | `/home/bookworm/code/e-commerce-pernulo/front-end/` |
| Frontend build output | `/home/bookworm/code/e-commerce-pernulo/front-end/build/` |
| Python venv | `/home/bookworm/.pyenv/versions/pernulo/` |
| Node.js | `/home/bookworm/.nvm/versions/node/v22.22.0/` |
| API env file | `/home/bookworm/code/e-commerce-pernulo/api/.env` |
| SQLite database | `/home/bookworm/code/e-commerce-pernulo/api/products.db` |
| Serve config | `/home/bookworm/code/e-commerce-pernulo/front-end/serve.json` |
| API service file | `~/.config/systemd/user/pernulo_api.service` |
| Frontend service file | `~/.config/systemd/user/pernulo_frontend.service` |
| Tunnel service file | `~/.config/systemd/user/pernulo_tunnel.service` |
| Tunnel config | `~/.cloudflared/pernulo.yml` |

## Environment Variables (`api/.env`)

```
DATABASE_URL=sqlite:///products.db
SECRET_KEY=<jwt-signing-key>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_ADDRESS=...
EMAIL_PASSWORD=...
```

## Important Configuration

**API base URL** (frontend calls to API):
- Defined in `front-end/src/constants/api.js`
- Production value: `https://pernulo-api.ftdalpha.com`
- Baked into the build — changing it requires a frontend rebuild

**CORS origins** (API allows requests from):
- Defined in `api/app.py` in the `CORS()` call
- Must include `https://pernulo.ftdalpha.com` for production

**Tunnel config** (`~/.cloudflared/pernulo.yml`):
- Must use `127.0.0.1` not `localhost` (avoids IPv6 resolution issues with cloudflared)

---

## Redeploying After Code Changes

### API changes only

```bash
systemctl --user restart pernulo_api.service
systemctl --user status pernulo_api.service
```

No build step needed — gunicorn reloads the Flask app on restart.

### Frontend changes only

```bash
cd /home/bookworm/code/e-commerce-pernulo/front-end
/home/bookworm/.nvm/versions/node/v22.22.0/bin/npm run build
systemctl --user restart pernulo_frontend.service
systemctl --user status pernulo_frontend.service
```

### Both API and frontend

```bash
# 1. Rebuild frontend
cd /home/bookworm/code/e-commerce-pernulo/front-end
/home/bookworm/.nvm/versions/node/v22.22.0/bin/npm run build

# 2. Restart both services
systemctl --user restart pernulo_api.service pernulo_frontend.service

# 3. Verify
systemctl --user is-active pernulo_api.service pernulo_frontend.service pernulo_tunnel.service
```

### If you changed Python dependencies

```bash
/home/bookworm/.pyenv/versions/pernulo/bin/pip install -r api/requirements.txt
systemctl --user restart pernulo_api.service
```

### If you changed Node dependencies

```bash
cd /home/bookworm/code/e-commerce-pernulo/front-end
/home/bookworm/.nvm/versions/node/v22.22.0/bin/npm install
/home/bookworm/.nvm/versions/node/v22.22.0/bin/npm run build
systemctl --user restart pernulo_frontend.service
```

### If you changed a service file

```bash
systemctl --user daemon-reload
systemctl --user restart pernulo_api.service pernulo_frontend.service pernulo_tunnel.service
```

---

## Service Management

### Check status

```bash
# All three at once
systemctl --user status pernulo_api pernulo_frontend pernulo_tunnel

# Quick check
systemctl --user is-active pernulo_api pernulo_frontend pernulo_tunnel
```

### View logs

```bash
# API logs (live)
journalctl --user -u pernulo_api -f

# Frontend logs
journalctl --user -u pernulo_frontend -f

# Tunnel logs (useful for diagnosing bad gateway)
journalctl --user -u pernulo_tunnel -f

# Last 50 lines
journalctl --user -u pernulo_api -n 50
```

### Stop everything

```bash
systemctl --user stop pernulo_tunnel pernulo_frontend pernulo_api
```

### Enable/disable on boot

All three services are currently enabled (start on login):

```bash
# Disable
systemctl --user disable pernulo_api pernulo_frontend pernulo_tunnel

# Enable
systemctl --user enable pernulo_api pernulo_frontend pernulo_tunnel
```

---

## Health Checks

```bash
# API responds
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8540/api/products

# Frontend responds
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8541

# Public URLs
curl -s -o /dev/null -w "%{http_code}" https://pernulo.ftdalpha.com
curl -s -o /dev/null -w "%{http_code}" https://pernulo-api.ftdalpha.com/api/products
```

---

## Database

- **Engine:** SQLite (`api/products.db`)
- **ORM:** SQLModel (SQLAlchemy + Pydantic)
- **Schema creation:** Auto-created on app startup via `SQLModel.metadata.create_all(engine)`
- **No migration system** — schema changes require manual ALTER TABLE or recreating the DB
- **Backup:** `cp api/products.db api/products.db.bak`

---

## Troubleshooting

### Bad Gateway (502)

The Cloudflare Tunnel returns 502 when it cannot reach the origin service.

1. **Check services are running:**
   ```bash
   systemctl --user is-active pernulo_api pernulo_frontend pernulo_tunnel
   ```

2. **Check ports are listening:**
   ```bash
   ss -tlnp | grep -E '854[01]'
   ```
   Expected: both 8540 and 8541 listening on `127.0.0.1` or `*`.

3. **Check tunnel logs for connection errors:**
   ```bash
   journalctl --user -u pernulo_tunnel -n 20 --no-pager
   ```
   - `dial tcp [::1]:8541: connection refused` = IPv6 issue. Fix: use `127.0.0.1` instead of `localhost` in `~/.cloudflared/pernulo.yml`.
   - `connection refused` on correct IP = service is down, check its logs.

4. **Frontend crash-looping (serve.json missing):**
   ```bash
   journalctl --user -u pernulo_frontend -n 10 --no-pager
   ```
   If you see `ENOENT: .../serve.json`, the file was deleted. Recreate it:
   ```bash
   echo '{"rewrites": [{"source": "**", "destination": "/index.html"}]}' > /home/bookworm/code/e-commerce-pernulo/front-end/serve.json
   systemctl --user restart pernulo_frontend.service
   ```

### CORS errors in browser console

The API must explicitly allow the frontend origin. Check `api/app.py` CORS config includes `https://pernulo.ftdalpha.com`.

### API 500 errors

```bash
journalctl --user -u pernulo_api -f
```

Common causes:
- Missing `.env` values (Cloudinary, email, SECRET_KEY)
- Database file permissions or corruption
- Missing Python dependencies — run `pip install -r api/requirements.txt`

### Frontend shows stale content after code changes

The frontend is a static build. You must rebuild:
```bash
cd /home/bookworm/code/e-commerce-pernulo/front-end
/home/bookworm/.nvm/versions/node/v22.22.0/bin/npm run build
systemctl --user restart pernulo_frontend.service
```

---

## External Dependencies

| Service | What it provides | Failure impact |
|---------|-----------------|----------------|
| Cloudinary | Product image hosting/upload | Images won't load; uploads fail |
| Google OAuth | Social login | Google sign-in broken; email/password still works |
| SMTP (email) | Password reset emails | Password reset flow broken |
| Cloudflare Tunnel | Public HTTPS access | Site unreachable externally; localhost still works |
