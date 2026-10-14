# Sarla Hooda — LIC Insurance Consultant Website + Smart CRM

A complete, production-grade digital insurance advisory platform and smart CRM built for **Sarla Hooda**, MDRT Qualified Life Insurance Corporation of India (LIC) Insurance Advisor.

---

## 1. Verified Business Details

- **Name:** Sarla Hooda
- **Profession:** LIC Insurance Advisor
- **Achievement:** MDRT Qualified (Million Dollar Round Table)
- **Client Base:** 700+ Satisfied Families
- **Direct Phone:** `+91 93503 04831` (`tel:+919350304831`)
- **Official WhatsApp:** `+91 93503 04831` (`https://wa.me/919350304831`)
- **Advisory Focus:** Ethical, need-based life protection, retirement pension, child education corpus, and doorstep claim assistance.
- **Service Area:** Haryana (Rohtak, Jhajjar, Sampla, Bahadurgarh), Delhi NCR, and Pan-India policyholders.

> **Regulatory Compliance:** This portal is an independent advisory and client service platform operated by Sarla Hooda (LIC Advisor). It is not the corporate website of the Life Insurance Corporation of India. All insurance products, bonuses, and policies are subject to official LIC terms and conditions.

---

## 2. Core Features & Architecture

### A. Elegant Mobile-First Public Consulting Portal
- **Refined Color Palette:** Midnight Navy (`#10243A`), White (`#FFFFFF`), Ivory (`#F7F6F2`), Muted Gold (`#C5A46D`), and Slate (`#667085`).
- **Bilingual Interface:** Instant switching between English and authentic Devanagari Hindi (`हिन्दी`) across headlines, service cards, quizzes, forms, popups, and the CRM.
- **Hero Section:** Features headline:
  - English: *"Your Family’s Future Deserves Thoughtful Protection."*
  - Hindi: *"आपके परिवार का भविष्य सही सुरक्षा का हकदार है।"*
- **Primary CTAs:** Save Contact, Call Now, WhatsApp, Explore Insurance Options, Book a Consultation.
- **Portrait & Digital Business Card:** High-resolution professional portrait of Sarla Hooda, verified MDRT credentials, 700+ client shield, and live scannable QR Code / NFC URL.

### B. Smart Website-Opening Contact Popup
- Prompts: *"Save Sarla Hooda’s Contact"* / *"सरla हुड्डा का संपर्क नंबर सेव करें"*
- Downloads a standards-compliant **`.vcf` vCard 3.0** directly to iOS, Android, or desktop contacts.
- Consent-respecting: remembers dismissal in `localStorage` without blocking website access.

### C. 7-Question Smart Insurance Recommendation Quiz
- Title: *"Find the Right Insurance Direction for Your Needs"* / *"अपनी ज़रूरत के अनुसार सही बीमा विकल्प समझें।"*
- One-question-at-a-time interactive workflow with progress indicator.
- Evaluates: Primary requirement, approximate budget, payment frequency, planning term, intended beneficiary, priority goal, and callback preference.
- Generates a tailored direction summary and passes it seamlessly to the Consultation Form.

### D. Customer Information Form & Location Intelligence
- Fields: Full Name, 10-digit Mobile, Optional Email, Village/City, Address, Preferred Language, Insurance Requirement, Contact Method, and Explicit Consultation Consent.
- **GPS Location Detection:** When explicitly permitted, uses browser geolocation and reverse-geocoding to detect village/town/city name. Raw coordinates are never stored; manual entry fallback is always available.
- Strict privacy: No passwords, OTPs, Aadhaar, or bank details are requested.

### E. Dedicated Customer CRM & Cold Lead Follow-up ("Reconnect with Customers")
- Accessible via the **Advisor Portal** at `/admin`.
- Complete lead profiles with status transitions: *New Lead, Cold Lead, Contacted, Interested, Follow-up Required, Consultation Scheduled, Deal Won, Deal Lost, Not Interested*.
- **"Reconnect with Customers" Reminder System:** Configurable threshold (default: 14 days). Alerts Sarla: *“You last contacted this customer on [Date]. Would you like to follow up?”*
- Categorized views: *Today's follow-ups, Overdue follow-ups, Upcoming follow-ups, Cold leads*.
- Quick action buttons: One-click WhatsApp, Direct Call, Reschedule Date, Mark Completed.

### F. Deal Won / Deal Lost Message Assistant
- Pre-composed, respectful English and Hindi Devanagari message templates.
- **Deal Won:** Welcome and thank-you, policy documentation follow-up, customer service greeting, policy anniversary greeting, renewal reminder, referral request.
- **Deal Lost (Non-Pushy):** Polite, respectful reconnect message without pressure.
- Dynamic variable substitution (`[Customer Name]`, `[Insurance Interest]`, `[Village/City]`).
- One-click **"Open in WhatsApp"** with encoded text, and automatic CRM interaction logging.

### G. Real Analytics & Security Audit Trail
- Real event tracking: Page views, vCard downloads, Call button clicks, WhatsApp clicks, Quiz starts & completions, Form submits.
- Security Audit Log: Records admin logins, failed attempts, content modifications, and lead deletions.
- **RFC 4180 CSV Export:** With formula injection protection (sanitizes `=, +, -, @, \t, \r` prefixes) and UTF-8 BOM encoding.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, QRCode
- **Backend Server:** Node.js, Express, tsx
- **Development Server:** Vite 8 with Express middlewares mounted
- **Authentication & Security:** bcryptjs password hashing, JWT bearer tokens, brute-force rate limiter (5-attempt lockout for 15 minutes)
- **Data Persistence:** Persistent atomic JSON database engine with transaction safety (`data/app_database.json`)

---

## 4. Local Setup & Installation

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation Steps

1. Clone or extract the repository:
   ```bash
   cd sarla-hooda-lic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to customize `PORT` (default: `3000`) and `JWT_SECRET`.

4. Start Full-Stack Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 5. Admin Portal Credentials

- **URL:** `http://localhost:3000/#admin` or click **"Advisor Portal"** in the top navbar / footer.
- **Default Email:** `sarla.hooda@licadvisor.in`
- **Default Secure Password:** `SarlaMDRT2026!`
- *Password can be updated anytime inside the portal under settings with an immutable audit log entry.*

---

---

## 6. Vercel Deployment Guide

This project is configured for full-stack deployment on Vercel using Vite for the static frontend and Vercel Serverless Functions (`api/index.ts`) for the Express backend API.

### Architecture on Vercel
- **Frontend SPA:** Built with Vite into the `dist/` directory, automatically cached and distributed globally across Vercel’s Edge Network.
- **Backend API:** Express application wrapped into a Serverless Function at `api/index.ts`. All `/api/*` traffic is routed via `vercel.json`.
- **Client-Side Routing:** Deep links (e.g., `/admin`, `#admin`, `/quiz`) fall back to `dist/index.html` via `vercel.json` rewrites.

### Method 1: Deploy via Vercel Dashboard & GitHub (Recommended)

1. **Push your code to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: prepare Sarla Hooda LIC CRM for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/sarla-hooda-lic.git
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New Project"** > **"Import Git Repository"**.
   - Select your repository.

3. **Configure Project Settings in Vercel:**
   - **Framework Preset:** `Vite` (automatically detected)
   - **Build Command:** `npm run build` (or `vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables in Vercel:**
   Go to the **Environment Variables** section in the project setup screen (or under *Settings > Environment Variables*):
   - `JWT_SECRET`: Enter a secure 32+ character random secret (e.g. `openssl rand -base64 32`)
   - `ADMIN_DEFAULT_PASSWORD`: *(Optional)* Custom initial password for `sarla.hooda@licadvisor.in` (defaults to `SarlaMDRT2026!`)
   - `NODE_ENV`: `production`
   - `APP_URL`: Your Vercel domain (e.g. `https://your-project.vercel.app`)

5. **Click "Deploy":**
   - Vercel will install dependencies, compile the frontend to `dist/`, build the `api/index.ts` serverless function, and assign a production URL.

---

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Log in and deploy from project root:
   ```bash
   vercel
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

---

### Data Persistence on Vercel Serverless

- **Current Implementation:** On Vercel, the application automatically redirects local filesystem writes to `/tmp/sarla_crm_data/app_database.json`. This prevents `EROFS: read-only file system` crashes and allows full in-memory CRM interaction.
- **Serverless Ephemeral Storage Notice:** Serverless functions on Vercel are stateless and recycle when cold-starting. Changes written to `/tmp` persist during active container instances but reset on new deployments or fresh container spins.
- **Production Database Recommendation:** For permanent multi-instance data persistence on Vercel, connect an external managed database:
  - **Relational SQL (PostgreSQL):** [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres].
  - **NoSQL / Document:** [MongoDB Atlas] or [Upstash Redis].
  The repository is structured with clean service layers (`server/db.ts` and `server/routes/`), allowing straightforward migration of query methods to your preferred database driver or ORM (such as Drizzle or Prisma).

---

### Alternative Self-Hosted Deployment (Cloud Run, Docker, VPS)
To deploy as a continuous Node.js process instead of serverless:
1. Build frontend:
   ```bash
   npm run build
   ```
2. Start continuous server:
   ```bash
   npm run start
   ```
   The server binds to port `3000` (or the environment `$PORT`). In this mode, `data/app_database.json` persists on persistent volumes.

---

## 7. Mandatory Verification Testing Summary

| Test Item | Description | Status |
|---|---|---|
| 1 | Project installs dependencies and builds cleanly (`npm run build`) | **PASSED** (Vite + tsc verified) |
| 2 | Public website opens with responsive design on mobile and desktop | **PASSED** |
| 3 | Language switcher toggles English & authentic Devanagari Hindi | **PASSED** |
| 4 | Contact popup appears non-intrusively and dismisses gracefully | **PASSED** |
| 5 | `.vcf` vCard downloads with verified Sarla Hooda details | **PASSED** (RFC 2426 format) |
| 6 | Call link (`tel:+919350304831`) & WhatsApp link (`wa.me`) verified | **PASSED** |
| 7 | QR Code dynamically generated from live site URL | **PASSED** |
| 8 | Customer enquiry form validates input and saves to database | **PASSED** (`/api/leads`) |
| 9 | Geolocation permission denial allows manual village/city entry | **PASSED** |
| 10 | 7-question Insurance Quiz completes with tailored direction | **PASSED** |
| 11 | Submitted quiz direction passes into CRM customer record | **PASSED** |
| 12 | Admin login with JWT & bcrypt password verification | **PASSED** |
| 13 | Unauthenticated users denied access to protected `/api/leads` | **PASSED** (401 Unauthorized) |
| 14 | Lead statuses and internal notes persist across refreshes | **PASSED** |
| 15 | Clicking "Reconnect with Customers" opens full customer record | **PASSED** |
| 16 | Won / Lost Message Assistant formats personalized WhatsApp links | **PASSED** |
| 17 | CSV export conforms to RFC 4180 with formula injection protection | **PASSED** |
| 18 | Content Manager edits persist and update live public website | **PASSED** |
| 19 | Verified phone/WhatsApp numbers sync centrally | **PASSED** |
| 20 | Graceful error handling for missing fields and rate limits | **PASSED** |
| 21 | No secret credentials in frontend client code | **PASSED** |
| 22 | Type check (`tsc --noEmit`) passes with 0 errors | **PASSED** |
| 23 | No third-party builder branding in public interface | **PASSED** |
| 24 | Real database persistence with pre-seeded demo records | **PASSED** |
