# Vercel Deployment Guide - Obsidian Nexus

## ✅ Issues Fixed

### 1. Database Connection Error (Build Time)
- **Problem**: Pages were trying to connect to database during build time (SSG)
- **Solution**: Added `export const dynamic = 'force-dynamic'` to force runtime rendering
- **Files Modified**:
  - `src/app/(dashboard)/clients/page.tsx`
  - `src/app/(dashboard)/tasks/page.tsx`

### 2. Middleware Size Limit Exceeded
- **Problem**: NextAuth middleware was 1.03 MB (limit: 1 MB)
- **Solution**: Created lightweight custom middleware using cookie-based auth check
- **File Modified**: `src/middleware.ts`

---

## 🚀 Deployment Steps

### Step 1: Vercel Environment Variables Setup

Go to your Vercel project → **Settings** → **Environment Variables** and add:

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here-use-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app

# Supabase (Optional - if using Supabase Storage/Auth)
SUPABASE_URL=https://wplzbfsgtumwjsxxyaku.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# AI (Optional - if using Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Redis (Optional - if using caching)
REDIS_URL=your-redis-url
```

**Important Notes:**
- Use **Connection Pooling URL** for `DATABASE_URL` (with `pgbouncer=true`)
- Use **Direct Connection URL** for `DIRECT_URL` (for migrations)
- Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
- Set `NEXTAUTH_URL` to your actual Vercel deployment URL

### Step 2: Database Connection String Format

For Supabase, get your connection strings from:
1. Go to Supabase Dashboard → **Project Settings** → **Database**
2. Copy **Connection Pooling** string for `DATABASE_URL`
3. Copy **Direct Connection** string for `DIRECT_URL`

### Step 3: Deploy

```bash
# Push your changes
git add .
git commit -m "fix: vercel deployment issues - dynamic rendering and lightweight middleware"
git push origin main
```

Vercel will automatically deploy.

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Build completes without database connection errors
- [ ] Middleware size is under 1 MB
- [ ] Protected routes redirect to `/sign-in` when not authenticated
- [ ] Database queries work at runtime
- [ ] All pages load correctly

---

## 🐛 Troubleshooting

### If build still fails with database errors:
1. Check that `dynamic = 'force-dynamic'` is added to all pages using Prisma
2. Verify `DATABASE_URL` is set in Vercel environment variables
3. Make sure database is accessible from Vercel's IP ranges

### If middleware size is still too large:
1. Check that you're using the lightweight middleware (not NextAuth's full middleware)
2. Verify no large dependencies are imported in `middleware.ts`

### If authentication doesn't work:
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your deployment URL
3. Test sign-in flow manually

---

## 📝 Additional Optimizations

### For Production:
1. Enable Vercel Analytics
2. Set up proper error monitoring (Sentry)
3. Configure caching strategies
4. Set up CI/CD with preview deployments

### Database Performance:
1. Use connection pooling (already configured)
2. Add database indexes for frequently queried fields
3. Consider using Prisma Accelerate for caching

---

## 🎯 Next Steps

1. Test the deployment thoroughly
2. Set up custom domain (if needed)
3. Configure CORS for API routes
4. Set up monitoring and alerts
5. Document API endpoints

