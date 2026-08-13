# AWS Route53 Clone — Master Development Plan

Scope is locked to the assignment brief. Nothing added beyond it. This document is the single source of truth we track against — update it as phases complete.

**Stack**: Next.js (TypeScript) frontend · FastAPI backend · SQLite database  
**Workflow per phase**: PLAN → IMPLEMENT → TEST → DEBUG → AUDIT → GIT COMMIT → GIT PUSH → NEXT PHASE  
**Rule**: No phase starts until the previous phase is confirmed working.

---

## Tracking Table

| Phase | Name | Status |
|---|---|---|
| **0** | **Project Foundation** | ✅ **Completed** |
| **1** | **Authentication** | ✅ **Completed** |
| **2** | **Hosted Zones** | ✅ **Completed** |
| **3** | **DNS Records** | ✅ **Completed** |
| **4** | **Route53 UI** | ⏳ **Next Up** |
| **5** | **Search/Filters/Pagination/UX** | Pending |
| **6** | **Mocked Route53 Sections** | Pending |
| **7** | **Polish/Security/Performance** | Pending |
| **8** | **Documentation** | Pending |
| **9** | **Deployment** | Pending |

---

## Phase Breakdown & Architecture

### PHASE 0 — Project Foundation (Completed)
- Initialize git repo & `.gitignore`
- Scaffold `frontend/` (Next.js + TypeScript)
- Scaffold `backend/` (FastAPI + SQLite via SQLAlchemy)
- Base folder structure for both
- Commit: `chore: initialize project foundation`

### PHASE 1 — Authentication (Completed)
- Backend: login (`/api/auth/login`), registration (`/api/auth/register`), current user (`/api/auth/me`), JWT token issuance, password hashing via bcrypt
- Frontend: login/register page, auth helper, session storage, protected route handling
- Commit: `feat: implement authentication`

### PHASE 2 — Hosted Zones (Completed)
- Backend: Hosted Zone model + CRUD API endpoints (`/api/hosted-zones`), auto-creation of default NS and SOA records, SQLite persistence
- Frontend: API client functions (`fetchHostedZones`, `createHostedZone`, `fetchHostedZoneById`, `updateHostedZone`, `deleteHostedZone`)
- Commit: `feat: implement hosted zone crud`

### PHASE 3 — DNS Records (Completed)
- Backend: DNS Record model (FK to Hosted Zone) + CRUD API endpoints (`/api/hosted-zones/{zone_id}/records` & `/api/records/{record_id}`), record type validation (A, AAAA, CNAME, TXT, MX, NS, SOA, PTR, SRV, CAA), hosted zone record count updates
- Frontend: API client functions (`fetchZoneRecords`, `createDNSRecord`, `fetchDNSRecordById`, `updateDNSRecord`, `deleteDNSRecord`)
- Commit: `feat: implement dns record crud`

### PHASE 4 — Route53 UI
- Route53-style navigation/sidebar/layout
- Route53-styled tables for zones and records
- Route53-styled forms and modals for create/edit
- Toast/notification system
- Commit: `feat: build route53 hosted zones ui`, `feat: build dns records ui`

### PHASE 5 — Search / Filters / Pagination / UX
- Search on hosted zones list
- Search + filter (by record type) on DNS records list
- Pagination on both lists
- Commit: `feat: add search and pagination`

### PHASE 6 — Mocked Route53 Sections
- Placeholder pages for Dashboard, Traffic Policies, Health Checks, Resolver, Profiles ("Coming Soon")
- Commit: `feat: add mocked coming-soon sections`

### PHASE 7 — Polish / Security / Performance
- Input validation hardening (frontend + backend)
- Auth/session security review
- Error handling consistency
- Commit: `fix: resolve authentication issue`

### PHASE 8 — Documentation
- Finalize README with setup instructions, architecture overview, database schema, API overview
- Commit: `docs: add project documentation`

### PHASE 9 — Deployment
- Deploy backend + frontend
- Verify live demo works end-to-end
- Commit: `chore: prepare production deployment`

---

## Project Structure

```
route53-clone/
├── frontend/
│   ├── app/
│   │   ├── login/page.tsx
│   │   └── route53/
│   │       ├── layout.tsx
│   │       ├── page.tsx                      # dashboard (mock)
│   │       ├── hosted-zones/
│   │       │   ├── page.tsx                  # list
│   │       │   ├── new/page.tsx               # create
│   │       │   └── [id]/page.tsx              # detail + records
│   │       ├── traffic-policies/page.tsx      # "Coming soon" mock
│   │       ├── health-checks/page.tsx         # mock
│   │       ├── resolver/page.tsx              # mock
│   │       └── profiles/page.tsx              # mock
│   ├── components/
│   │   ├── aws/ (Sidebar, Header, Breadcrumbs, DataTable, SearchBar, Modal, Toast, Pagination)
│   │   ├── hosted-zones/
│   │   └── dns-records/
│   ├── lib/ (api.ts, auth.ts)
│   └── types/ (hosted-zone.ts, dns-record.ts)
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/ (user.py, hosted_zone.py, dns_record.py)
│   │   ├── schemas/ (auth.py, hosted_zone.py, dns_record.py)
│   │   ├── routers/ (auth.py, hosted_zones.py, records.py)
│   │   └── services/ (auth_service.py, hosted_zone_service.py, record_service.py)
│   ├── requirements.txt
│   └── database.db
│
└── README.md
```