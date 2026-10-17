# Tricity RealtyOS

**The Complete Lead-to-Site-Visit and Property Inventory Management Platform for Real Estate Businesses**  
*Built specifically for builders, developers, channel partners, and brokers in Chandigarh, Mohali, Zirakpur, Panchkula, and New Chandigarh.*

---

## 🌟 Executive Overview
**Tricity RealtyOS** is a commercial B2B SaaS platform engineered from the ground up for the unique dynamics of the Tricity property corridor. Unlike generic international CRMs, RealtyOS addresses the core operational bottlenecks of Indian real estate sales:
- **Lead Duplicate Guard**: Normalizes Indian mobile numbers (`+91`) and blocks duplicate entries across portals (MagicBricks, 99acres, Facebook Ads, Walk-ins).
- **Formula Injection-Safe CSV Import/Export**: Prevents spreadsheet formula execution vulnerabilities (OWASP CSV Injection mitigation) while importing and exporting client databases.
- **Multi-Tower Inventory Matrix**: Atomic status transitions (`AVAILABLE` → `ON_HOLD` → `BOOKED` → `SOLD`) with automated hold expiration TTL guards to eliminate double-selling.
- **Site Visit Scheduling Engine**: Conflict-detection checks that prevent double-booking sales consultants, automatic pipeline stage advancement, and outcome tracking.
- **Official WhatsApp Cloud API**: Webhook verification with HMAC SHA256 signatures, automated site visit confirmations with Google Maps coordinates, project brochure delivery, and dev sandbox mode.
- **Tiered Commercial Subscriptions**: Flexible SaaS packages (Starter ₹4,999/mo, Growth ₹9,999/mo, Business ₹19,999/mo) with real-time entitlement enforcement.
- **Multi-Tenant Database Scoping**: Strict row-level tenant boundaries and role-based permissions matrix (`SUPER_ADMIN`, `OWNER`, `ADMIN`, `SALES_MANAGER`, `SALES_REP`, `VIEWER`).

---

## 👥 Pre-Configured Demo Personas
To evaluate and demonstrate the product without manual data entry, use any of the seeded personas:

| Persona | Organization & Role | Email | Password | Primary Workflow |
|---|---|---|---|---|
| **Platform Super Admin** | Global Platform Governance | `superadmin@tricityrealty.com` | `TricityPass123!` | `/admin` (MRR, Tenant Orgs, Audit Logs) |
| **Builder Owner** | Sushma Urban Developers (Zirakpur) | `owner@sushmagroup.com` | `TricityPass123!` | `/dashboard` (Executive KPIs, Inventory, Holds) |
| **Brokerage Owner** | Tricity Prime Brokers (Chandigarh) | `owner@primechd.com` | `TricityPass123!` | `/dashboard` (Multi-project brokerage pipeline) |
| **Sales Representative** | Sushma Urban Developers | `rahul.sales@sushmagroup.com` | `TricityPass123!` | `/dashboard/leads` (Assigned leads, Call logging) |

*A floating **Demo Role Switcher** is also available in the bottom-right corner of the application for instant 1-click login.*

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js `20.x` or `24.x`
- npm `10.x` or `11.x`

### 2. Installation & Database Setup
```bash
# Clone or navigate to the repository
cd tricity-realtyos

# Install production and development dependencies
npm install

# Initialize database schema (SQLite locally, PostgreSQL in production)
npm run db:push

# Seed realistic Tricity real estate data (Sushma Grande, The Palm Mohali, leads, inventory)
npm run db:seed
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3050](http://localhost:3050) in your browser.

---

## 🧪 Automated Testing & Verification

### Run Vitest Automated Test Suite
```bash
npm test
```
*Executes unit and integration tests covering Indian phone normalization, RBAC permission matrix, CSV formula injection sanitization, WhatsApp HMAC SHA256 verification, and multi-tenant isolation.*

### Run Load & Concurrency Benchmark
```bash
npm run loadtest
```
*Simulates concurrent virtual user stages (5 → 25 → 50 concurrent VUs) measuring response latencies and zero-error rates.*

### Production Build Verification
```bash
npm run build
```

---

## 🏗️ Technology Stack

- **Frontend & Full-Stack Core**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling & UI**: Tailwind CSS, Lucide React, Accessible Responsive Layouts
- **Database & ORM**: Prisma ORM with SQLite for instant local zero-dependency testing + PostgreSQL production schema (`prisma/schema.postgresql.prisma`)
- **Authentication**: Custom Secure Session Engine (Jose JWT + HttpOnly/Secure/SameSite=Lax cookies + Bcryptjs)
- **WhatsApp Integration**: Official Meta WhatsApp Business Cloud API with HMAC SHA256 webhook validator and sandbox simulator
- **Testing**: Vitest, React Testing Library, k6 load scripts

---

## 🛡️ Security & Compliance Highlights
1. **Tenant Isolation**: Every database query scopes strictly by `organizationId` derived from the verified session token.
2. **Formula Injection Sanitization**: Prepends `'` to cells starting with `=, +, -, @, \t` to protect Excel users from malicious formula execution.
3. **Indian DPDP Act 2023 Compliance**: Granular Cookie Consent Banner with persistent preferences, privacy notices at collection points, and data archiving tools.

---

## 📄 Documentation Links
- **Implementation Status**: [IMPLEMENTATION_STATUS.md](file:///C:/Users/Xiaomi/Downloads/Projects/tricity-realtyos/IMPLEMENTATION_STATUS.md)
- **Production Readiness & Runbook**: [PRODUCTION_READINESS.md](file:///C:/Users/Xiaomi/Downloads/Projects/tricity-realtyos/PRODUCTION_READINESS.md)
- **Environment Template**: [.env.example](file:///C:/Users/Xiaomi/Downloads/Projects/tricity-realtyos/.env.example)
- **PostgreSQL Schema**: [prisma/schema.postgresql.prisma](file:///C:/Users/Xiaomi/Downloads/Projects/tricity-realtyos/prisma/schema.postgresql.prisma)
