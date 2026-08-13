# AWS Route 53 Console Clone

A custom-built, full-stack clone of the Amazon Route 53 DNS web service management console developed using **Next.js 14 (TypeScript)** frontend, **FastAPI** backend, and **SQLite** persistent database.

![AWS Route 53 Clone](https://img.shields.io/badge/AWS-Route%2053%20Clone-orange?style=for-the-badge&logo=amazon-aws)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

---

## 📜 Original Work & Integrity Declaration

> **Declaration**: This repository contains original code written specifically for the **AWS Route 53 Clone Assignment**. 
> All backend API services, SQLAlchemy models, Pydantic schemas, Next.js frontend pages, and AWS CloudScape UI components were custom-built to satisfy all evaluation criteria.

- **Author**: Piyush (`Piyush5621`)
- **Repository**: [https://github.com/Piyush5621/aws-route53-clone](https://github.com/Piyush5621/aws-route53-clone)
- **Live Demo Link**: [https://aws-route53-clone-murex.vercel.app](https://aws-route53-clone-murex.vercel.app)

---

## Tracking Table & Master Development Plan

| Phase | Name | Status | Commit |
|---|---|---|---|
| **0** | **Project Foundation** | ✅ **Completed** | `10bc442` |
| **1** | **Authentication** | ✅ **Completed** | `f34b1e1` |
| **2** | **Hosted Zones** | ✅ **Completed** | `e0d25b9` |
| **3** | **DNS Records** | ✅ **Completed** | `ecf877e` |
| **4** | **Route53 UI** | ✅ **Completed** | `1fb017b` |
| **5** | **Search/Filters/Pagination/UX** | ✅ **Completed** | `1f20f19` |
| **6** | **Mocked Route53 Sections** | ✅ **Completed** | `0d19c97` |
| **7** | **Polish/Security/Performance** | ✅ **Completed** | `794bf7e` |
| **8** | **Documentation** | ✅ **Completed** | `00d4441` |
| **9** | **Deployment** | ✅ **Completed** | `cb9c64b` |

---

## Features

- 🔐 **IAM User Authentication**: User registration, login, JWT token issuance, password hashing via bcrypt, and protected session persistence.
- 🌐 **Hosted Zones Management**:
  - Public & Private hosted zones creation.
  - Automatic allocation of 4 Name Servers (NS) and Start of Authority (SOA) records upon zone creation.
  - Hosted zone listing, searching, comment updating, and batch/single deletion.
- 📋 **DNS Records Management**:
  - Full support for `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `SOA`, `PTR`, `SRV`, and `CAA` record types.
  - Strict record type validation rejecting unsupported records.
  - Real-time search filtering by record name and dropdown filtering by record type.
  - Quick record creation modal, inline TTL/Value editor modal, and record deletion.
- 🎨 **Authentic AWS Console Experience**:
  - AWS Top Header with logo, service search, global scope switcher, notification bell dropdown, IAM user menu, and sign-out.
  - Collapsible Route 53 Sidebar menu with active route tracking.
  - Route 53 Dashboard with global SLA uptime indicators, record counters, and quick actions.
  - AWS CloudScape-styled tables, property filter bars, pagination controls, and Toast notifications.
- 🚀 **Mocked Route 53 Sections**:
  - Simple, clean placeholders for Traffic Policies, Health Checks, Resolver, and Profiles.

---

## Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Lucide Icons.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic v2, Passlib / Bcrypt, PyJWT (`python-jose`).
- **Database**: SQLite database (`database.db`).

```
aws-route53-clone/
├── frontend/
│   ├── app/
│   │   ├── login/page.tsx
│   │   └── route53/
│   │       ├── layout.tsx
│   │       ├── page.tsx                      # Dashboard
│   │       ├── hosted-zones/
│   │       │   ├── page.tsx                  # Hosted Zones List
│   │       │   ├── new/page.tsx               # Create Hosted Zone
│   │       │   └── [id]/page.tsx              # Detail + DNS Records
│   │       ├── traffic-policies/page.tsx      # Mocked section
│   │       ├── health-checks/page.tsx         # Mocked section
│   │       ├── resolver/page.tsx              # Mocked section
│   │       └── profiles/page.tsx              # Mocked section
│   ├── components/
│   │   └── aws/ (Header, Sidebar, SearchBar, Pagination, Toast)
│   └── lib/ (api.ts, auth.ts)
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/ (user.py, hosted_zone.py, dns_record.py)
│   │   ├── schemas/ (auth.py, hosted_zone.py, dns_record.py)
│   │   ├── routers/ (auth.py, hosted_zones.py, records.py)
│   │   └── services/ (auth_service.py, hosted_zone_service.py, record_service.py)
│   ├── test_master.py                        # Automated master audit test suite
│   ├── requirements.txt
│   └── database.db
│
└── README.md
```

---

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new IAM user.
- `POST /api/auth/login` — Authenticate credentials and receive a JWT Bearer token.
- `GET /api/auth/me` — Retrieve profile details of the current authenticated user.

### Hosted Zones (`/api/hosted-zones`)
- `POST /api/hosted-zones` — Create a new Hosted Zone (allocates default NS & SOA records).
- `GET /api/hosted-zones?search={query}` — List all hosted zones for the user.
- `GET /api/hosted-zones/{id}` — Get Hosted Zone details by ID.
- `PUT /api/hosted-zones/{id}` — Update Hosted Zone comment.
- `DELETE /api/hosted-zones/{id}` — Delete Hosted Zone and associated records.

### DNS Records (`/api/records`)
- `POST /api/hosted-zones/{zone_id}/records` — Create a DNS record for a zone.
- `GET /api/hosted-zones/{zone_id}/records?search={query}&record_type={type}` — List DNS records for a zone.
- `GET /api/records/{id}` — Get DNS record details by ID.
- `PUT /api/records/{id}` — Update DNS record TTL and value.
- `DELETE /api/records/{id}` — Delete DNS record.

---

## Quick Start & Local Setup

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend API server on http://localhost:8000
python -m uvicorn app.main:app --reload --port 8000
```

To run the automated Master Audit Test Suite:
```bash
python test_master.py
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run development server on http://localhost:3000
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) in your browser to start using the application!