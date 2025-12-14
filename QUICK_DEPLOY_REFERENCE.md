# 🚀 Quick Deploy Reference Card

## ⚡ 30-Second Checklist

### Before Pushing to Git:
```bash
✅ npm run build          # Test build locally
✅ Check .env.example     # Verify all required vars
✅ Review changes         # git diff
```

### In Vercel Dashboard:
```bash
✅ Set DATABASE_URL       # Supabase connection pooling
✅ Set DIRECT_URL         # Supabase direct connection
✅ Set NEXTAUTH_SECRET    # openssl rand -base64 32
✅ Set NEXTAUTH_URL       # https://your-app.vercel.app
```

### After Deployment:
```bash
✅ Check build logs       # No errors
✅ Test homepage          # Loads correctly
✅ Test sign-in           # Authentication works
✅ Test /clients          # Database queries work
✅ Test /tasks            # Database queries work
```

---

## 🔑 Critical Environment Variables

### Copy-Paste Template:
```bash
# Supabase Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.wplzbfsgtumwjsxxyaku.supabase.co:5432/postgres"

# NextAuth (Generate secret: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional: Supabase
SUPABASE_URL="https://wplzbfsgtumwjsxxyaku.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"

# Optional: AI
GEMINI_API_KEY="your-gemini-api-key"
```

### Where to Get Values:

| Variable | Where to Find |
|----------|---------------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection Pooling |
| `DIRECT_URL` | Supabase → Settings → Database → Direct Connection |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel deployment URL |
| `SUPABASE_KEY` | Supabase → Settings → API → anon public |
| `GEMINI_API_KEY` | Google AI Studio → API Keys |

---

## 🐛 Quick Troubleshooting

### Build Fails with Database Error
```bash
❌ Can't reach database server
✅ Add: export const dynamic = 'force-dynamic'
✅ Location: Top of page.tsx files
```

### Middleware Size Error
```bash
❌ Edge Function size is 1.03 MB
✅ Use lightweight middleware (already fixed)
✅ Check: src/middleware.ts uses cookie check only
```

### 401 Unauthorized
```bash
❌ Unauthorized on protected routes
✅ Check: NEXTAUTH_SECRET is set
✅ Check: NEXTAUTH_URL matches deployment URL
✅ Clear browser cookies and retry
```

### Database Queries Fail
```bash
❌ Prisma query errors at runtime
✅ Check: DATABASE_URL has ?pgbouncer=true
✅ Check: Supabase database is running
✅ Verify: Connection string password is correct
```

---

## 📝 Git Commands

### Deploy to Vercel:
```bash
git add .
git commit -m "fix: vercel deployment issues"
git push origin main
```

### Rollback if Needed:
```bash
git revert HEAD
git push origin main
```

---

## 🔍 Verification URLs

After deployment, test these:

```bash
# Homepage
https://your-app.vercel.app/

# Sign In
https://your-app.vercel.app/sign-in

# Protected Routes (should redirect if not logged in)
https://your-app.vercel.app/clients
https://your-app.vercel.app/tasks
https://your-app.vercel.app/settings

# API Routes
https://your-app.vercel.app/api/accounts
https://your-app.vercel.app/api/tasks
```

---

## 📊 Success Indicators

### Build Logs Should Show:
```
✓ Compiled successfully
✓ Generated Prisma Client
✓ Generating static pages (12/12)
✓ Build Completed in /vercel/output
✓ Deploying outputs...
```

### Should NOT Show:
```
❌ Can't reach database server
❌ Edge Function size exceeds limit
❌ Build failed
❌ Error: ECONNREFUSED
```

---

## 🎯 Files Changed (Reference)

```
Modified:
├── src/app/(dashboard)/clients/page.tsx    [+3 lines]
├── src/app/(dashboard)/tasks/page.tsx      [+3 lines]
├── src/middleware.ts                       [Complete rewrite]
└── next.config.ts                          [+15 lines]

Created:
├── .vercelignore
├── VERCEL_DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_FIX_HINDI.md
├── CHANGES_SUMMARY.md
└── verify-deployment-fixes.md
```

---

## 💡 Pro Tips

1. **Test Locally First**
   ```bash
   npm run build && npm start
   ```

2. **Check Environment Variables**
   ```bash
   # In Vercel dashboard, verify all vars are set
   # Apply to: Production, Preview, Development
   ```

3. **Monitor Build Time**
   - Normal: 30-40 seconds
   - If > 60 seconds, check for issues

4. **Use Preview Deployments**
   - Test on preview URL before merging to main
   - Each PR gets automatic preview

5. **Enable Vercel Analytics**
   - Monitor performance
   - Track errors
   - Analyze user behavior

---

## 📞 Support Links

- **Vercel Status:** https://www.vercel-status.com/
- **Supabase Status:** https://status.supabase.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 🎉 Success Message

If you see this in Vercel:
```
✓ Build completed successfully
✓ Deployment ready
```

**Congratulations! 🎊 Your app is live!**

Visit: `https://your-app.vercel.app`

---

**Quick Reference Version:** 1.0
**Last Updated:** 2025-12-14
**Status:** Production Ready ✅

