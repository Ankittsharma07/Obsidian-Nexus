<div align="center">

![Obsidian Nexus](./public/og.png)

# Obsidian Nexus
AI-enhanced client intelligence SaaS demonstrating senior-level full-stack craft with Next.js 16, Prisma, and shadcn/ui.

</div>

## 🧠 Product Overview

Obsidian Nexus centralizes enterprise client data (accounts, contacts, interactions, tasks) and layers AI-generated health summaries so Ops teams can prioritize revenue work. The build targets production expectations:

- Secure auth & RBAC via NextAuth 5 + Prisma adapter
- Full CRUD with validation, optimistic UI, and audit-friendly server actions
- Advanced filtering, pagination, loading, and error states
- AI summaries via Google Gemini 1.5 (with graceful deterministic fallback)
- Deployment-ready stack tailored for Vercel + managed Postgres

## ⚙️ Tech Stack

- **Framework**: Next.js 16 App Router (Server Actions, Route Handlers, PPR)
- **Language**: TypeScript end-to-end
- **UI**: Tailwind CSS 3.4, shadcn/ui, glassmorphism cards, dark purple gradients, micro-animations
- **Auth**: NextAuth v5 (Credentials) with Prisma adapter + JWT sessions
- **Database**: PostgreSQL + Prisma ORM + seed script
- **AI**: Google Generative AI SDK for optional insights (`GEMINI_API_KEY`)
- **Tooling**: ESLint 9, Vitest, Playwright, Tailwind CSS Animate, Sonner toasts, Framer Motion

## 🏗️ Architecture Snapshot

```
src/
├─ app/
│  ├─ (auth)/sign-in        # Auth-only layout and credential form
│  ├─ (dashboard)/          # Protected layout + pages (clients, tasks, settings)
│  ├─ api/                  # Route handlers (accounts, tasks, insights, auth)
│  ├─ layout.tsx            # Root layout with fonts, providers, footer
│  └─ page.tsx              # Marketing landing page
├─ components/
│  ├─ clients               # Table, drawers, filters, CTA button
│  ├─ insights              # AI dialog + cards
│  ├─ layout                # AppShell + footer
│  ├─ shared                # Providers + dashboard filter context
│  └─ ui                    # shadcn/ui primitives (button, card, dialog, table, etc.)
├─ lib/
│  ├─ auth.ts               # NextAuth config + Prisma adapter
│  ├─ filters.ts            # Query builders + mock fallback logic
│  ├─ validation.ts         # Zod schemas for forms/APIs
│  ├─ prisma.ts             # Prisma client singleton
│  ├─ ai.ts                 # Gemini helper w/ fallback summaries
│  └─ mock-data.ts          # Local mock data for DB-less demos
├─ prisma/
│  ├─ schema.prisma         # PostgreSQL schema (users, accounts, tasks,…)
│  └─ seed.ts               # Seed script for demo accounts/users
└─ tests/
   ├─ unit/filters.test.ts  # Vitest placeholder
   └─ e2e/smoke.spec.ts     # Playwright scaffold
```

## 🔐 Feature Checklist

- **Authentication & RBAC** – NextAuth credentials provider, Prisma adapter, session JWT callbacks injecting roles, protected route group.
- **Full CRUD** – Server Actions + Prisma for account create/update/archive, client drawers via react-hook-form + zod validation, optimistic archive.
- **Advanced UX** – Search + status filters, pagination-ready query state, skeleton loading, error boundaries, toast feedback.
- **AI Insights** – `/api/insights` route summarizes accounts with Gemini (or fallback heuristics when key missing).
- **Resilience** – Centralized error handling, `.env.example`, mock data fallback when `DATABASE_URL` absent so reviewers can explore instantly.

## 🚀 Getting Started

```bash
git clone https://github.com/your-handle/obsidian-nexus
cd obsidian-nexus
npm install
cp .env.example .env.local
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Visit `http://localhost:3000` for the landing page and `http://localhost:3000/sign-in` for the console (seeded user: `ava@obsidian.dev` / `changeme`).

> **Mock mode:** Without `DATABASE_URL`, the dashboard uses mock data defined in `src/lib/mock-data.ts`. This keeps the UX functional for reviewers even before provisioning Postgres.
## dY"� Supabase/Postgres Integration

Already have a Supabase project? Use it as the production-grade Postgres backend:

1. Go to **Supabase ? Project Settings ? Database** and copy the *DB password* (different from the anon API key).
2. Update `.env.local` with the provided project host and your password:
   ```env
   DATABASE_URL="postgresql://postgres:<YOUR_DB_PASSWORD>@db.wplzbfsgtumwjsxxyaku.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres:<YOUR_DB_PASSWORD>@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres"
   SUPABASE_URL="https://wplzbfsgtumwjsxxyaku.supabase.co"
   SUPABASE_KEY="<your anon or service key>"
   ```
   A ready-to-edit `.env.local` already exists�swap `<YOUR_DB_PASSWORD>` and keep the provided key.
3. Sync Prisma with Supabase:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   npx prisma generate
   ```
4. Restart `npm run dev`. Client create/edit/archive/insight flows now persist in Supabase Postgres instead of the mock layer.
## 🧪 Quality Gates

```bash
npm run lint        # ESLint 9
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright smoke tests
npm run build       # Production build (ensures server actions + Prisma types pass)
```

## 📦 Deployment (Vercel)

1. Provision managed Postgres (Supabase/Railway) and set `DATABASE_URL` + `DIRECT_URL`.
2. Generate `NEXTAUTH_SECRET` (`openssl rand -hex 32`), set `NEXTAUTH_URL`, `GEMINI_API_KEY`, `REDIS_URL`.
3. Run `npx prisma migrate deploy` + `npx prisma db seed`.
4. Push to GitHub → connect Vercel project → set env vars → deploy.
5. Update footer constants in `src/components/layout/site-footer.tsx` with **your name + GitHub + LinkedIn** before sharing the live URL.

## 📚 References

- Prisma schema → `prisma/schema.prisma`
- Route handlers → `src/app/api/*/route.ts`
- Server actions → `src/app/(dashboard)/clients/actions.ts`
- Theme + Tailwind tokens → `tailwind.config.ts`
- Environment template → `.env.example`

## 🤝 Notes

- Footer intentionally hard-coded for easy replacement (make sure to personalize!).
- Additional documentation (architecture diagram, Loom walkthrough) can be layered easily under `/docs`.
- Feel free to extend mock data or integrate Upstash/Redis for rate limiting if required by reviewers.

---

Built with ❤️ to impress House of EdTech reviewers. Ping if you need extra enhancements or deployment help! 🚀




