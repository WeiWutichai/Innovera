# Deploy Checklist — Security Remediation

**Deploy model:** push/merge to `main` → GitHub Actions (`.github/workflows/deploy.yml`) → **manual approval gate** (GitHub `production` Environment) → SSH to VPS → `cd /root/Innovera && bash deploy.sh` (`git reset --hard origin/main` + `docker compose up -d --build`; `docker-entrypoint.sh` runs `prisma migrate deploy` on boot).

> Merging to `main` no longer deploys instantly — the job pauses in the **Actions tab → "Review deployments"** until a required reviewer approves. Do the manual prep below, then approve.

## What CI/CD does automatically ✅
- Pull latest code (`git reset --hard origin/main`)
- Rebuild + restart containers (`docker compose up -d --build`)
- Run DB migrations (`prisma migrate deploy`) — incl. `isApproved` default → `false`
- Backend healthcheck

## What CI/CD does NOT do — you must do these manually ⛔
The `.env` on the VPS is gitignored and untouched by CI/CD; provider secrets and the DB live outside the repo.

---

## BEFORE you approve the deployment

### 1. Rotate the compromised secrets (CRITICAL — were in git history / Docker layers)
Edit `/root/Innovera/.env` on the VPS:
- [ ] `AUTH_SECRET` → `openssl rand -base64 48` (note: invalidates all existing sessions)
- [ ] `GOOGLE_CLIENT_SECRET` → rotate in Google Cloud Console
- [ ] `LINE_CHANNEL_ACCESS_TOKEN` + `LINE_CHANNEL_SECRET` → reissue in LINE Developers Console
- [ ] `POSTGRES_PASSWORD` / `DATABASE_URL` → rotate DB password (update DB + URL)
- [ ] Admin password → change after first login (committed defaults are burned)

### 2. New / important env vars on the VPS `.env`
- [ ] `ALLOW_UNSIGNED_LINE_WEBHOOK` — must be **unset** in prod; `LINE_CHANNEL_SECRET` **must** be set (else webhook returns 401).
- [ ] reCAPTCHA — chat now **fails closed** when a site key is configured: set BOTH the client site key and server `RECAPTCHA_SECRET_KEY`, OR leave the site key **unset** to run without captcha.
- [ ] `ADMIN_PASSWORD` — only if re-running `node prisma/seed-admin.js` (seed refuses to run without it; never resets an existing admin).

### 3. Reverse proxy / TLS (REQUIRED — app now binds 127.0.0.1)
- [ ] nginx/Caddy proxies `:443` → `127.0.0.1:${APP_PORT}`.
- [ ] Valid TLS cert is live BEFORE deploy — HSTS (`max-age=31536000`) is now sent; a broken cert locks browsers to HTTPS for a year.

### 4. Backup
- [ ] DB: `docker exec innovera-db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup_$(date +%F).sql`
- [ ] Uploads: `docker run --rm -v innovera_uploads_data:/data -v "$PWD":/b alpine tar czf /b/uploads_$(date +%F).tgz -C /data .`

---

## DEPLOY
- [ ] Merge the PR → the deploy job starts and **waits for approval**.
- [ ] In **Actions → the run → Review deployments → approve `production`**.
- [ ] Watch it succeed; `docker compose ps` shows backend `healthy`.
- [ ] `docker compose logs backend | grep -i migrat` shows the migration ran.

## AFTER deploy

### 5. Verify migration + audit data
- [ ] Default fixed:
  ```sql
  SELECT column_default FROM information_schema.columns
  WHERE table_name='User' AND column_name='isApproved';   -- expect: false
  ```
- [ ] Audit users auto-approved while the bug was live (migration does NOT touch existing rows):
  ```sql
  SELECT id,email,role,"isApproved","createdAt" FROM "User" WHERE "isApproved"=true ORDER BY "createdAt";
  UPDATE "User" SET "isApproved"=false WHERE id IN (...);  -- the ones that shouldn't be approved
  ```

### 6. Smoke tests
- [ ] Login (approved works / unapproved blocked); 6 rapid bad logins → rate-limited.
- [ ] `/admin` non-staff redirects, `/api/admin/*` → 403; OWNER can reach `/admin`.
- [ ] Chat IDOR: `GET /api/chat/history/<other-session>` without matching id → 401/403.
- [ ] Guest + logged-in chat works; upload >5MB / non-image rejected.
- [ ] Real signed LINE event accepted.
- [ ] `curl -sI https://<domain> | grep -iE 'strict-transport|content-security|x-frame'`
- [ ] `curl -s https://<domain>/api/users` contains no `password`.

### 7. Cleanup
- [ ] `docker builder prune -af` on the VPS (drop cached layers holding old secrets).
- [ ] Purge the committed password from git history (BFG / git-filter-repo + force-push).

## Follow-ups (non-blocking)
- [ ] Pin `appleboy/ssh-action` to a commit SHA (currently `@v1`).
- [ ] Tighten CSP (remove `unsafe-inline`/`unsafe-eval` via nonces).
- [ ] Convert issue `status`/`supportStatus` to Prisma enums.

## Rollback
- [ ] `git revert` the merge (or reset `main`) → next deploy redeploys old code (approval gate still applies).
- [ ] DB change is backward-compatible; restore from the §4 dump if needed.
