# GEO Trips – Travel Agency Platform & Management System

> **"1 Stop Multiple Service"** — Certified travel agency with 25+ years of trusted excellence in international flight ticketing, visa consultation, custom holiday packages, Hajj & Umrah services, and hotel reservations.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🌟 Overview

**GEO Trips** is a modern, full-stack web application and back-office management system designed for **GEO Trips**, a premier travel agency headquartered in Motijheel, Dhaka, Bangladesh. Led by **Md Mesbah Uddin** (a certified agent for **Singapore Airlines** and **Biman Bangladesh Airlines** with 25+ years of industry experience and 500+ satisfied clients), the platform serves a dual purpose:

1. **Public-Facing Web Portal**: A sleek, high-trust, responsive website welcoming travelers and corporate clients. It showcases services, dynamic visa requirements, photo specifications, flight inquiry channels, an interactive trip planner, and a dedicated self-service **Client Dashboard**.
2. **Background Admin Portal & CRM**: A protected, behind-the-scenes back-office management suite that replaces legacy Excel spreadsheets with automated financial tracking (Client Price vs. Vendor Cost), multi-service invoice generation, money receipt vouchers, client passport archives with Google Drive links, payment verification queues, and vendor liability management.

---

## 🏗️ Architecture & Dual-Tier Design

```
                     ┌─────────────────────────────────────────────────────┐
                     │                     GEO TRIPS                       │
                     └──────────────────────────┬──────────────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌─────────────────────────────┐                               ┌─────────────────────────────┐
  │     PUBLIC WEB PORTAL       │                               │    BACKGROUND ADMIN PORTAL   │
  │     (Client-Facing)         │                               │     (Staff & Operations)    │
  ├─────────────────────────────┤                               ├─────────────────────────────┤
  │ • Landing & Hero Showcase   │                               │ • Executive KPI Dashboard   │
  │ • Air Ticketing & Services  │                               │ • Purchases & Profit Ledger │
  │ • Visa Requirements Hub     │                               │ • Master Invoice Generator  │
  │ • Interactive Trip Planner  │                               │ • Serialized Money Receipts │
  │ • About, Gallery, FAQ       │                               │ • Client CRM & Drive Links  │
  │ • Hotline & WhatsApp CTAs   │                               │ • Bookings & Leads Pipeline │
  │ • Secure Client Dashboard   │                               │ • Payment Verification Inbox│
  │   - Trip & Visa Status      │                               │ • Dynamic Visa Configurator │
  │   - Billing & Statements    │                               │ • Vendor & Payable Manager  │
  │   - Bank Receipt Uploads    │                               └─────────────────────────────┘
  │   - Passport Profiles       │
  └─────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 🌐 Public-Facing Web Portal

* **High-Trust, Modern Landing Page**:
  * Hero banner with instant service triggers, hotline contact, and airline certification badges.
  * Live stats counters highlighting 25+ years of experience, 500+ corporate & family clients, and worldwide airline ticketing.
  * Trust badges and real client testimonials reflecting credibility and legitimacy.
  * Sticky announcement bar with operating hours and emergency hotline numbers.
  * Floating quick-action triggers for **WhatsApp** and **Phone Calls**.

* **Comprehensive Travel Services (`/services`)**:
  * **International & Domestic Air Ticketing**: Best available private fares and GDS inventory for worldwide routes and domestic flights across Bangladesh.
  * **Visa Submission Assistance**: Professional visa guidance, document screening, and embassy submission.
  * **Custom Tour Packages**: Tailor-made domestic and international itineraries with detailed costing breakdowns.
  * **Hajj & Umrah Pilgrimages**: Reliable spiritual journey arrangements with trusted on-ground Saudi vendors.
  * **Global Hotel Reservations**: Competitive rates for handpicked hotels, resorts, and corporate accommodations.

* **Interactive Trip Planner Wizard (`/trip-planner`)**:
  * 4-step guided wizard (Destination -> Travel Style & Group Size -> Travel Dates -> Budget Range).
  * Instant dynamic cost estimate calculation.
  * Direct inquiry generation that automatically feeds qualified leads into the Admin CRM pipeline.

* **Visa Requirements & Document Directory (`/visa`)**:
  * Filterable catalog for major destinations: **Singapore, Malaysia, Thailand, China, Canada, Australia**, and more.
  * Transparent processing fees (in BDT), turnaround times, and validity terms.
  * Strict photo specifications (dimensions, matte paper guidelines, background requirements).
  * Role-based document checklists tailored to:
    * 💼 Job Holders (NOC, salary slips, visiting cards)
    * 🏢 Business Owners (Trade license, company pad, notary)
    * 🎓 Students (Institutional NOC, student ID)
    * 🩺 Doctors & Lawyers (BMDC / Bar Council certification)
    * 🧓 Retired Persons (Pension book / retirement documents)
    * 🏡 Housewives & 👶 Minors / Dependents

* **Informational & Company Pages**:
  * **About Us (`/about`)**: Background story of Md Mesbah Uddin, airline accreditations, and agency heritage.
  * **Gallery (`/gallery`)**: Curated travel photography from worldwide client trips.
  * **FAQ (`/faq`)**: Clear answers covering visa refusals, flight reissues, payment methods, and document safety.
  * **Contact (`/contact`)**: Office location in Motijheel, Dhaka, direct phone numbers, email address, and an inquiry form.

---

### 2. 👤 Client Dashboard (Self-Service Member Area)

Logged-in clients access a private portal (`/dashboard`) protected by Next.js middleware and Supabase authentication:

* **Trips & Services (`/dashboard/trips`)**:
  * Real-time tracking of booked flights (routes, departure/return dates, PNR codes).
  * Live visa application status tracker (Application Date, Processing Status, Embassy Approval).
  * Active holiday tour packages and confirmed hotel reservations.

* **Billing & Statements (`/dashboard/financials`)**:
  * Overview of total invoiced amounts, payments made, and outstanding balance dues.
  * Itemized breakdown of all services with printable digital invoices.

* **Payment Proof Uploads (`/dashboard/payments`)**:
  * Upload portal for bank deposit slips, internet banking screenshots, or bKash / Nagad mobile money transaction IDs.
  * Submissions notify administrators instantly for fast verification.

* **Passport & Travel Profile (`/dashboard/profile`)**:
  * Secure storage of passport numbers, expiry dates, date of birth, and nationality for expedited re-booking.

---

### 3. ⚙️ Background Admin Portal (Staff & Operations CRM)

The administrative back-office operates at `/admin`, protected by dual-layer security (Supabase Profile RBAC + Master Admin session cookie):

* **Executive Dashboard (`/admin`)**:
  * Real-time metrics: Total Billed Revenue, Total Collected Cash, Total Outstanding Dues, and Net Profit Margins.
  * Notification badges for pending payment verifications and unread trip planner leads.
  * Quick links to recent client transactions, invoices, and money receipts.

* **Purchases & Financial Ledger (`/admin/finance`)**:
  * **Excel Replacement**: Solves manual spreadsheet record-keeping.
  * Records **Client Selling Price vs. Vendor Net Cost** with auto-computed Profit Margins.
  * Dual-sided tracking: Client amount paid / balance due, and Vendor amount paid / balance due.
  * Quick filtering by service category (Flights, Visas, Hotels, Tours, Hajj/Umrah) and payment status.

* **Master Invoice Generator (`/admin/invoices`)**:
  * Combine multiple client purchases (e.g., flight ticket + visa + hotel) into a single unified master invoice.
  * Unique invoice numbering (`INV-YYYY-XXXX`), custom discounts, tax calculations, and notes.
  * Branded, printable, and PDF-ready invoice templates.

* **Money Receipts Manager (`/admin/receipts`)**:
  * Issue official serial-numbered money receipts (`MR-XXXXXX`) for every payment collected.
  * Supports multiple payment channels: **Cash, Bank Transfer, bKash, Nagad, Cheque, and Card**.
  * Printable receipt vouchers featuring formal authorized signature lines and client balance summaries.

* **Client CRM & Passport Dossier Manager (`/admin/clients`)**:
  * Complete traveler KYC database storing official passport identity fields: **Surname, Given Name(s), Nationality, Date of Birth, Gender, Father's Name, Mother's Name, and Permanent/Present Address**.
  * **Multi-Passport Support**: Link and archive multiple passports per client (Current active e-passports, expired machine-readable passports with past visa stamps, and dual nationalities) with validity tracking and primary designation.
  * **Dedicated Google Drive Links**: Directly store and open each client's private Google Drive document archive folder from the CRM table.
  * Instant passport validity alert badges (indicating valid vs. expiring soon `<180` days threshold).

* **Inquiry & Bookings Manager (`/admin/bookings`)**:
  * Central inbox capturing leads submitted via the public Trip Planner and contact forms.
  * Lead status pipeline: `New` ➔ `Contacted` ➔ `Quoted` ➔ `Converted` ➔ `Lost`.

* **Payment Verification Inbox (`/admin/verifications`)**:
  * Visual verification queue displaying client-submitted bank slips and mobile payment receipts.
  * 1-click **Approve** (automatically updates invoice and payment status to Paid) or **Reject** with admin feedback.

* **Visa Rules Manager (`/admin/visa`)**:
  * Admin controls to update country visa requirements, processing fees, validity, and document checklists in real time.

* **Vendor Management (`/admin/vendors`)**:
  * Directory of airlines, visa submission agents, hotel suppliers, and local tour operators.
  * Tracks total vendor bills, amount paid, and accounts payable liabilities.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Server Components, dynamic API routes, and streaming UI |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Frontend UI** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) | Modern responsive design with custom deep-navy & gold travel palette |
| **Animations & Icons** | [Framer Motion](https://www.framer.com/motion/) + [Lucide React](https://lucide.dev/) | Smooth transitions and iconography |
| **Backend & DB** | [Supabase](https://supabase.com/) (PostgreSQL) | Managed relational DB with Row Level Security (RLS) |
| **Authentication** | [Supabase Auth (SSR)](https://supabase.com/docs/guides/auth/server-side/nextjs) + Master Session | Secure cookie-based sessions with role-based routing |
| **File Storage** | Supabase Storage | Secure bucket storage for payment receipt uploads |
| **Deployment** | Vercel / Netlify | Production ready with `netlify.toml` configuration |

---

## 📂 Project Directory Structure

```plaintext
geo_portfolio/
├── app/
│   ├── (public)/                 # Public pages
│   │   ├── page.tsx              # Landing page (Hero, Stats, Services, Trust)
│   │   ├── about/page.tsx        # Agency background & certifications
│   │   ├── services/page.tsx     # Services overview
│   │   ├── visa/page.tsx         # Visa requirements directory
│   │   ├── trip-planner/page.tsx # Interactive 4-step trip planning wizard
│   │   ├── gallery/page.tsx      # Curated travel gallery
│   │   ├── faq/page.tsx          # FAQs
│   │   └── contact/page.tsx      # Office location & inquiry form
│   ├── auth/                     # Client authentication
│   │   ├── login/page.tsx        # Client login
│   │   └── register/page.tsx     # Client registration
│   ├── dashboard/                # Client self-service portal
│   │   ├── page.tsx              # Client dashboard overview
│   │   ├── trips/page.tsx        # Flight, tour, & visa status tracking
│   │   ├── financials/page.tsx   # Client invoices & dues statement
│   │   ├── payments/page.tsx     # Bank slip / receipt upload
│   │   └── profile/page.tsx      # Passport & profile management
│   ├── admin/                    # Background operations portal
│   │   ├── login/page.tsx        # Secure admin login
│   │   └── (dashboard)/
│   │       ├── page.tsx          # Executive dashboard & KPIs
│   │       ├── finance/page.tsx  # Purchases ledger (Client vs Vendor costs)
│   │       ├── invoices/page.tsx # Multi-item invoice generator
│   │       ├── receipts/page.tsx # Serialized money receipts
│   │       ├── visa/page.tsx     # Dynamic visa requirements manager
│   │       ├── clients/page.tsx  # CRM, passport vault & Google Drive links
│   │       ├── bookings/page.tsx # Bookings & trip planner leads pipeline
│   │       ├── verifications/    # Client receipt verification inbox
│   │       └── vendors/page.tsx  # Third-party vendor manager
│   ├── api/
│   │   ├── admin/login/route.ts  # Master admin authentication API
│   │   └── visa/route.ts         # Visa data API
│   ├── globals.css               # Styling and color themes
│   └── layout.tsx                # Root layout with site chrome
├── components/
│   ├── admin/                    # Admin sidebar, ledger, invoice & receipt components
│   ├── dashboard/                # Client dashboard sidebar and widgets
│   ├── home/                     # Hero, Stats, TrustBadges, Testimonials, VisaQuickView
│   ├── layout/                   # Navbar, Footer, FloatingCTAs, SiteChrome
│   ├── trip-planner/             # TripPlannerWizard interactive component
│   ├── ui/                       # BrandLogo, CountryFlag, custom UI elements
│   └── visa/                     # VisaDetailModal and document checklists
├── data/
│   └── visas.json                # Seed visa document checklists & requirements
├── lib/
│   ├── auth/admin-auth.ts        # Server-side admin verification utilities
│   ├── supabase/                 # Supabase client, server, and admin clients
│   ├── utils.ts                  # Currency formatting, date helpers, cn utility
│   └── visa-data.ts              # Visa requirement getters and helpers
├── middleware.ts                 # Route guards for /admin and /dashboard
├── supabase_schema.sql           # Database tables, RLS policies, and triggers
└── fix_admin_and_rls.sql         # Admin role configuration and RLS enhancements
```

---

## ⚡ Getting Started

### 1. Prerequisites

* **Node.js**: `v18.18+` or `v20+` installed.
* **npm** or **pnpm** or **yarn**.
* A **Supabase** project (free tier is fully compatible).

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/geo-trips.git
cd geo-trips
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory (based on `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Fill in your configuration:

```env
# Supabase credentials (from Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Master Admin credentials for production backup login
ADMIN_EMAIL=admin@geotrips.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 4. Database Setup (Supabase)

1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Copy and run the script in `supabase_schema.sql` to create all tables (`profiles`, `services`, `bookings`, `payments`, `invoices`, `money_receipts`, `payment_verifications`, `vendors`, `trip_leads`).
4. (Optional) Run `fix_admin_and_rls.sql` to ensure admin functions and storage bucket permissions are configured.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
* **Public Website**: [http://localhost:3000](http://localhost:3000)
* **Client Login**: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
* **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔐 Authentication & Access Control

* **Public**: Anyone can browse the website, inspect visa checklists, use the trip planner, and submit inquiries.
* **Client Role**: Users who register through `/auth/register` receive the `client` role and can view their personal bookings, upload bank slips, and download invoices at `/dashboard`.
* **Admin Role**: Users assigned the `admin` role in the `profiles` table (or signing in with configured master admin credentials) can access `/admin`.
* **Middleware Protection**: `middleware.ts` automatically redirects unauthorized traffic trying to access `/admin/*` or `/dashboard/*` to their respective login portals.

---

## 📞 Agency Contact Information

* **Agency**: GEO Trips ("1 Stop Multiple Service")
* **Proprietor**: Md Mesbah Uddin *(Certified Agent for Singapore Airlines & Biman Bangladesh Airlines)*
* **Address**: 154 C/A, Motijheel, Dhaka-1000, Bangladesh
* **Direct Hotline**: `+88 01913-389573` / `+88 01611-204561`
* **Email**: `geotrips19@gmail.com`
* **Office Hours**: Saturday – Thursday (9:00 AM – 6:00 PM)

---

## 📄 License

Private repository developed for **GEO Trips**. All rights reserved.
