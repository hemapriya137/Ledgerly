# 🌌 Ledgerly — 3D Freelancer Invoicing & Expense Engine

> A full-stack web application for modern freelancers and creative studios with a bold, unique 3D visual identity built with **React Three Fiber (R3F)**, **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM**, **NextAuth**, **Stripe**, and **Recharts**.

---

## ✨ Features

- **Interactive 3D Visual Identity**:
  - **Landing Page Hero**: Real-time 3D floating glassmorphic invoice cards, rotating gold currency tokens, and particle starfield rendered in React Three Fiber with smooth parallax mouse tilt physics.
  - **Ambient Dashboard 3D Canvas**: Drifting low-poly geometric crystal meshes in the background.
  - **Dynamic 3D Hover Tilt Cards**: Interactive perspective cards with real-time glare and light tracking.
  - **Deep Emerald & Warm Radiant Gold Palette**: Rich dark theme (`#040d0a` obsidian base, emerald accents, champagne gold highlights) with fine SVG grain noise overlay.
  - **Typography**: Display headings in `Outfit` paired with clean, readable data typography in `Plus Jakarta Sans`.
  - **Mobile Degradation**: Automatic lightweight CSS 3D fallback for mobile and reduced-motion environments.

- **Authentication & Roles**:
  - NextAuth Credentials provider with bcrypt encryption.
  - Quick 1-Click Demo Accounts for instant evaluation:
    - **Free Tier Demo**: `alex@ledgerly.io` (Password: `password123`)
    - **Pro Tier Demo**: `elena@ledgerly.io` (Password: `password123`)

- **Client Portfolio Management**:
  - Client profiles with contact info, company, notes, and invoicing telemetry.
  - **Free vs Pro Tier Gating**: Free tier is capped at **5 clients** with visual limit counters and Pro upgrade triggers. Pro unlocks unlimited clients.

- **Smart Multi-Item Invoice Engine**:
  - Dynamic line item wizard with live subtotal, tax %, discount %, and currency formatting.
  - Lifecycle state machine (`DRAFT` → `SENT` → `PAID` → `OVERDUE`).
  - **Public Shareable Client Invoice Portal** (`/invoice/[id]`): Clients can view branded invoices and trigger 1-click payment simulation without logging in.

- **High-Fidelity PDF & Print Generator**:
  - Vector PDF invoice generation and direct print styling.

- **Expense Radar & Receipt Attachments**:
  - Categorized overhead tracking (Software, Hardware, Travel, Contractor, Marketing, Office).
  - Receipt preview lightbox, billable client tags, and tax deduction tracking.

- **Financial Telemetry & Themed Recharts**:
  - 6-Month Income vs Expense flow area chart with glowing gradient fills and custom glass tooltips.
  - Expense Category donut chart with interactive segment breakdown.

- **Stripe Subscription Billing**:
  - Pro Tier gating ($19/mo or $190/yr) with Stripe checkout sessions, webhooks handler, and instant test-mode toggle.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom 3D shadows and animations |
| **3D Engine** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) |
| **Database** | [Prisma ORM](https://www.prisma.io/) with SQLite (local) / PostgreSQL (production Neon/Railway) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) (Credentials + JWT Session) |
| **Payments** | [Stripe](https://stripe.com/) (Subscription Checkout & Webhooks) |
| **Charts** | [Recharts](https://recharts.org/) customized with Emerald & Gold theme |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/) |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (the repository is preconfigured for instant local development with SQLite):
```bash
cp .env.example .env
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials

| Account | Email | Password | Tier / Status |
|---|---|---|---|
| **Alex Rivera** | `alex@ledgerly.io` | `password123` | **Free Tier** (4/5 clients used, 4 sample invoices, expenses) |
| **Elena Vance** | `elena@ledgerly.io` | `password123` | **Pro Tier** (Unlimited clients, enterprise branding, retainer billing) |

*You can also click the 1-Click Demo buttons on the `/login` page.*

---

## 📂 Project Directory Structure

```
Ledgerly/
├── prisma/
│   ├── schema.prisma         # User, Client, Invoice, InvoiceItem, Expense
│   ├── seed.ts               # Demo data generator
│   └── dev.db                # SQLite database
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Shell with 3D ambient canvas & nav
│   │   │   ├── dashboard/     # KPI cards, charts, recent invoices
│   │   │   ├── clients/       # Client CRUD + 5-client cap gating
│   │   │   ├── invoices/      # Invoice list, creation wizard, PDF exporter
│   │   │   │   ├── [id]/
│   │   │   │   └── new/
│   │   │   ├── expenses/      # Expense tracker & receipt viewer
│   │   │   └── settings/      # Studio branding & Stripe Pro billing
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── clients/
│   │   │   ├── dashboard/stats/
│   │   │   ├── expenses/
│   │   │   ├── invoices/
│   │   │   └── stripe/
│   │   ├── invoice/[id]/      # Public shareable client payment portal
│   │   ├── globals.css        # Emerald + Champagne Gold theme & glassmorphism
│   │   ├── layout.tsx         # Typography (Outfit + Plus Jakarta Sans)
│   │   └── page.tsx           # 3D Interactive Landing Page
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HeroScene3D.tsx        # R3F interactive 3D hero
│   │   │   ├── AmbientCanvas3D.tsx    # Low-poly drifting dashboard meshes
│   │   │   └── StaticHeroFallback.tsx # Mobile / fallback view
│   │   ├── charts/                    # Themed Recharts Area & Donut
│   │   ├── layout/                    # Navbar, DashboardHeader, Sidebar
│   │   ├── providers/                 # NextAuth AuthProvider
│   │   └── ui/                        # Card3D tilt, UpgradeModal
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       ├── session.ts
│       ├── stripe.ts
│       └── utils.ts
└── package.json
```

---

## 🚢 Deployment to Vercel & PostgreSQL (Neon / Supabase / Railway)

1. Set `DATABASE_URL` in Vercel to your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@neon.tech/ledgerly?sslmode=require"
   ```
2. Update `prisma/schema.prisma` provider to `postgresql`.
3. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
4. Deploy to Vercel!
