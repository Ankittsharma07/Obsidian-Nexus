# 🔐 Vercel Environment Variables - Exact Setup Guide

## ⚠️ IMPORTANT: Connection Pooling Required

Vercel serverless functions need **connection pooling** to avoid database connection limits!

---

## 📋 Step-by-Step Setup

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Select your project: **Obsidian-Nexus**
3. Go to: **Settings** → **Environment Variables**

---

### Step 2: Add These EXACT Variables

Copy-paste these values (already from your `.env.local`):

#### 1. DATABASE_URL (WITH Connection Pooling)
```
DATABASE_URL
```
**Value:**
```
postgresql://postgres:Houseofedtech%401234@db.wplzbfsgtumwjsxxyaku.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

**⚠️ IMPORTANT CHANGES:**
- Port changed: `5432` → `6543` (PgBouncer port)
- Added: `?pgbouncer=true&connection_limit=1`
- Removed: `sslmode=require` (not needed with pgbouncer)

---

#### 2. DIRECT_URL (Direct Connection)
```
DIRECT_URL
```
**Value:**
```
postgresql://postgres:Houseofedtech%401234@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres?sslmode=require
```

**Note:** This is same as your current DATABASE_URL (port 5432)

---

#### 3. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET
```
**Value:**
```
3391ef813d271c5568a41048d996a204156718fa4ddb95cfb82a1a7eaad9babd
```

---

#### 4. NEXTAUTH_URL
```
NEXTAUTH_URL
```
**Value:**
```
https://obsidian-nexus.vercel.app
```

**⚠️ REPLACE** `obsidian-nexus.vercel.app` with your actual Vercel deployment URL!

To find your URL:
- Go to Vercel Dashboard → Your Project → Domains
- Copy the `.vercel.app` URL

---

#### 5. SUPABASE_URL (Optional)
```
SUPABASE_URL
```
**Value:**
```
https://wplzbfsgtumwjsxxyaku.supabase.co
```

---

#### 6. SUPABASE_KEY (Optional)
```
SUPABASE_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHpiZnNndHVtd2pzeHh5YWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTc3MjMsImV4cCI6MjA4MTE5MzcyM30.JunkKqbTxBw5Liki6lezZE8Zs6vlIaGScrgvk6R5aoE
```

---

#### 7. GEMINI_API_KEY (Optional)
```
GEMINI_API_KEY
```
**Value:**
```
AIzaSyBsrVjwnMfk_7RyByCQvrY25YhbmDZpwYo
```

---

### Step 3: Apply to All Environments

For EACH variable, select:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

Then click **Save**.

---

## 🔍 Visual Guide

### In Vercel Dashboard:

```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│                                                  │
│ Key: DATABASE_URL                                │
│ Value: postgresql://postgres:Houseofedtech...   │
│ Environments: ☑ Production ☑ Preview ☑ Dev     │
│                                                  │
│ [Save]                                           │
└─────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After adding all variables:

- [ ] DATABASE_URL has port **6543** (not 5432)
- [ ] DATABASE_URL has `?pgbouncer=true&connection_limit=1`
- [ ] DIRECT_URL has port **5432**
- [ ] NEXTAUTH_URL is your actual Vercel URL (not localhost)
- [ ] All variables applied to Production, Preview, Development
- [ ] Clicked "Save" for each variable

---

## 🚀 Deploy Now

```bash
git add .
git commit -m "fix: turbopack config for Next.js 16"
git push origin main
```

Vercel will automatically redeploy with new environment variables!

---

## 🐛 If Still Getting Errors

### Error: "Can't reach database server"
**Fix:** Check DATABASE_URL has:
- Port: `6543` (not 5432)
- Query params: `?pgbouncer=true&connection_limit=1`

### Error: "Turbopack webpack config"
**Fix:** Already fixed in `next.config.ts` - just push the changes

### Error: "401 Unauthorized"
**Fix:** Update NEXTAUTH_URL to your actual Vercel URL

---

## 📊 Summary

| Variable | Port | Purpose |
|----------|------|---------|
| DATABASE_URL | 6543 | Connection pooling (runtime queries) |
| DIRECT_URL | 5432 | Direct connection (migrations) |
| NEXTAUTH_SECRET | - | Session encryption |
| NEXTAUTH_URL | - | Auth callback URL |

---

**Ready to deploy! 🚀**

