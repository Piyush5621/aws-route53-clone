# AWS Route 53 Console Clone

A full-stack clone of the Amazon Route 53 Console for managing Hosted Zones and DNS Records.

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