# Tricity RealtyOS — Production Readiness & Operational Runbook

**Product Name**: Tricity RealtyOS  
**Platform Version**: v1.0.0 (Commercial Production Release)  
**Target Market**: Real Estate Builders, Developers, Channel Partners & Brokerages in Chandigarh, Mohali, Zirakpur, Panchkula, and New Chandigarh.  
**Release Date**: October 2026  

---

## 1. Multi-Tenant Architecture & Data Isolation

### 1.1 Tenant Scoping Model
Every critical database record (`Lead`, `Project`, `InventoryUnit`, `SiteVisit`, `TaskFollowUp`, `LeadActivity`, `WhatsAppMessage`, `SubscriptionInvoice`) contains an indexed, foreign-key enforced `organizationId`.

### 1.2 Server-Side Authorization Enforcements
- Client-side headers or URL parameters containing tenant IDs are **never trusted**.
- Every request is validated against the authenticated session:
  ```ts
  const user = await requireTenantUser();
  const whereClause = { organizationId: user.organizationId };
  ```
- **Automated Verification**: `tests/integration/tenant-isolation.test.ts` proves that Organization A cannot view, update, export, or manipulate Organization B's data even with known record IDs.

---

## 2. Application Security & OWASP Review

| Security Category | Threat Vector | Implemented Defense Mechanism |
|---|---|---|
| **A01: Broken Access Control** | IDOR / Tenant Data Leakage | Strict server-side RBAC matrix (`src/lib/permissions.ts`) + tenant scoping on every DB query. |
| **A02: Cryptographic Failures** | Token / Password Leaks | Bcrypt salt rounds (10), Jose SignJWT (HS256, 32-byte secret), HttpOnly + Secure + SameSite=Lax cookie storage. |
| **A03: Injection (SQL & CSV)** | SQLi / Formula Injection | Prisma parameterized queries prevent SQL injection. `sanitizeCsvField` in `src/lib/csv.ts` prepends `'` to any cell starting with `=`, `+`, `-`, `@`, `\t` to prevent Excel DDE execution. |
| **A04: Insecure Design** | Double-Selling Inventory | Transactional status change in `src/app/api/inventory/[id]/status/route.ts` with hold expiry TTL guards. |
| **A05: Security Misconfiguration** | Exposed Secrets | Strict `.env.example` template; production builds redact credentials. |
| **A08: Software Integrity** | Webhook Forgery & Replays | HMAC SHA256 timing-safe signature verification (`verifyWhatsAppWebhookSignature`) on all Meta webhook payloads. |

---

## 3. Indian DPDP Act 2023 & Privacy Controls

- **Consent Management**: Interactive `CookieConsentBanner` categorizes cookies into Essential (session tokens), Performance, and Marketing. Preferences are persistent and editable.
- **Data Subject Rights**: Complete lead deletion and archiving APIs (`DELETE /api/leads/[id]`) with associated timeline audit logging.
- **Notice at Collection**: Public demo forms and lead forms display explicit privacy disclosures linking to `/privacy`.

---

## 4. Disaster Recovery & Backup Runbook

### 4.1 Automated PostgreSQL Backups (Daily & Hourly WAL)
```bash
# 1. Manual Backup Snapshot
pg_dump -U realty_user -h localhost -d realtyos -F c -b -v -f "/backups/realtyos_backup_$(date +%Y%m%d_%H%M%S).dump"

# 2. Automated S3 Backup Upload
aws s3 cp /backups/realtyos_backup_*.dump s3://tricity-realtyos-backups/daily/ --sse aws:kms
```

### 4.2 Restoration Procedure
```bash
# Drop existing scratch database or prepare new node
dropdb -U realty_user realtyos
createdb -U realty_user realtyos

# Restore from snapshot
pg_restore -U realty_user -d realtyos -v "/backups/realtyos_backup_latest.dump"
```

### 4.3 Rollback Deployment Procedure
If a production release introduces regression:
```bash
# 1. Revert container image to previous tag
docker compose stop app
docker compose up -d --no-deps app:v1.0.0-previous

# 2. Revert Prisma migration if schema was updated
npx prisma migrate resolve --rolled-back "20261017_migration_name"
```

---

## 5. Load & Stress Test Benchmarks

- **Target Capacity**: 100 concurrent Virtual Users (VUs) sustaining peak weekend property site visit scheduling and brochure downloads.
- **Latency SLAs**:
  - `p(95) < 300ms` for API read operations
  - `p(99) < 800ms` for complex dashboard aggregations
  - `Error Rate < 0.01%`
- **Execution Script**: Run `npm run loadtest` or `k6 run tests/load/k6-load-test.js`.
