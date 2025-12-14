## How to Run Obsidian Nexus Locally

Follow these steps from the project root (`obsidian-nexus/`):

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy the provided example file and fill in the values:
     ```bash
     cp .env.example .env.local
     ```
   - At minimum you need:
     - `DATABASE_URL` (PostgreSQL connection string). If you don’t have a database yet, you can skip this and the app will use the built-in mock data.
     - `NEXTAUTH_SECRET` (generate via `openssl rand -hex 32`)
     - `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
     - Optional: `GEMINI_API_KEY`, `REDIS_URL`

3. **Set up Prisma (optional but recommended)**
   - If you provided a `DATABASE_URL`, run:
     ```bash
     npx prisma migrate dev
     npx prisma db seed
     ```
   - Without a DB, the app still works using mock data defined in `src/lib/mock-data.ts`.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000` for the landing page.
   - Visit `http://localhost:3000/sign-in` and log in with the seed user:
     - Email: `ava@obsidian.dev`
     - Password: `changeme`

5. **Available scripts**
   - `npm run lint` – ESLint check
   - `npm run test` – Vitest unit tests
   - `npm run test:e2e` – Playwright (requires dev server running)

> If you previously saw the error about `experimental.ppr`, it’s fixed—`next.config.ts` now uses the new `cacheComponents` flag compatible with Next.js 16.
### Supabase quick start

If you�re using the provided Supabase project (`https://wplzbfsgtumwjsxxyaku.supabase.co`):

1. Copy `.env.local` (already included) and replace `<SUPABASE_DB_PASSWORD>` with the password from **Supabase ? Settings ? Database**.
2. Keep the provided `SUPABASE_URL`/`SUPABASE_KEY` values intact.
3. Run
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   npx prisma generate
   ```
4. Restart `npm run dev`. CRUD now persists to Supabase Postgres instead of the mock layer.

