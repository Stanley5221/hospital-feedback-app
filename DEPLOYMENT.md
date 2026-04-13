# Vercel Deployment Guide

Complete step-by-step guide to deploy the Hospital Feedback System on Vercel.

## Prerequisites

- GitHub account with the project repository
- Vercel account (free at https://vercel.com)
- Supabase project already configured
- All environment variables documented in `.env.local`

## Deployment Steps

### Step 1: Prepare GitHub Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Hospital feedback system: Ready for deployment"

# Create repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hospital-feedback.git
git push -u origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to https://vercel.com and sign in
2. Click **Add New** → **Project**
3. Look for "Import Git Repository"
4. Authorize GitHub access if prompted
5. Select your `hospital-feedback` repository
6. Click **Import**

### Step 3: Configure Environment Variables

In the Vercel import page:

1. Find the **Environment Variables** section
2. Add these 4 variables:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxxxx.supabase.co
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Name: NEXT_PUBLIC_APP_URL
   Value: https://hospital-feedback-xxxxx.vercel.app
   ```

   ⚠️ Replace `hospital-feedback-xxxxx` with your Vercel URL (you'll see it after first deploy)

3. Click **Deploy**

### Step 4: Wait for Deployment

Vercel will:
1. Install dependencies
2. Run build command
3. Deploy to CDN
4. Show you a live URL

This takes 3-5 minutes. You'll see:
```
✓ Production
  Deployed to https://hospital-feedback-xxxxx.vercel.app
```

### Step 5: Get Your Production URL

The URL format is:
```
https://hospital-feedback-xxxxx.vercel.app
```

Keep this for the next step.

### Step 6: Update Supabase Auth URLs

Now update Supabase to recognize your new domain:

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Authentication** (left sidebar) > **URL Configuration**
4. Update these fields:

   **Site URL:**
   ```
   https://hospital-feedback-xxxxx.vercel.app
   ```

   **Redirect URLs:**
   ```
   https://hospital-feedback-xxxxx.vercel.app/admin/dashboard
   https://hospital-feedback-xxxxx.vercel.app
   https://hospital-feedback-xxxxx.vercel.app/thank-you
   ```

5. Click **Save**

### Step 7: Test Production Deployment

1. Visit `https://hospital-feedback-xxxxx.vercel.app`
2. Submit a test feedback
3. Go to `https://hospital-feedback-xxxxx.vercel.app/admin/login`
4. Login with admin credentials
5. Check that data appears in dashboard

## Updating Environment Variables

If you need to change environment variables later:

1. Go to Vercel project settings
2. Click **Settings** tab
3. Select **Environment Variables** (left sidebar)
4. Edit or add new variables
5. Click **Save**
6. Trigger a redeploy:
   - Click **Deployments**
   - Find the latest deployment
   - Click **...** menu
   - Select **Redeploy**

## Redeploying After Changes

### Option 1: Push to GitHub (Recommended)

```bash
git add .
git commit -m "Update feedback system"
git push origin main
```

Vercel automatically deploys when you push to main.

### Option 2: Manual Redeploy from Vercel

1. Go to Vercel project
2. Click **Deployments**
3. Find the latest deployment
4. Click **...** menu
5. Click **Redeploy**

## Monitoring Deployments

1. Go to your Vercel project
2. **Deployments** tab shows all versions
3. Click any deployment to see:
   - Build logs
   - Performance metrics
   - Real-time status

## Performance Monitoring

Vercel provides free analytics:

1. Go to project **Analytics** tab
2. View:
   - Page load times
   - Core Web Vitals
   - Traffic patterns
   - Geographic distribution

## Scaling & Limits

### Free Tier Limits
- 12 deployments/month
- 100 GB bandwidth/month
- Unlimited projects
- Fast CDN globally

### If You Need More
- Upgrade to **Pro**: $20/month
- Upgrade to **Enterprise**: Custom pricing
- Get dedicated support
- Higher deployment limits

## Troubleshooting Vercel Deployments

### Problem: Build Fails

**Check build logs:**
1. Go to **Deployments**
2. Click the failed deployment
3. Scroll to see error messages
4. Fix the issue locally
5. Push to GitHub to redeploy

**Common errors:**
- Missing dependencies → `npm install`
- Environment variables → Check .env.local
- TypeScript errors → Run `npm run build` locally first

### Problem: "Supabase configuration missing" in Production

**Solution:**
1. Go to Vercel project settings
2. Click **Environment Variables**
3. Verify all 4 variables are present
4. Click **Redeploy** on latest deployment

### Problem: Admin login not working in Production

**Solution:**
1. Check Supabase **Authentication > URL Configuration**
2. Verify your Vercel URL is listed in "Redirect URLs"
3. Check email/password in Supabase **Authentication > Users**
4. Try in incognito window (clear cookies)

### Problem: Photos not uploading in Production

**Solution:**
1. Check Supabase **Storage** > `feedback-photos` bucket
2. Verify **Public** toggle is ON
3. Check RLS policies:
   ```
   SELECT - Everyone (anon)
   INSERT - Everyone (anon)
   ```

## Rollback to Previous Version

If something goes wrong:

1. Go to **Deployments**
2. Find a working previous deployment
3. Click **...** menu
4. Click **Promote to Production**
5. Old version is now live

## Custom Domain (Optional)

To use your own domain:

1. In Vercel project **Settings**
2. Click **Domains** (left sidebar)
3. Enter your domain name
4. Follow instructions to update DNS
5. Wait for SSL certificate (auto)
6. Update Supabase auth URLs with your domain

Example: Use `feedback.yourhospital.com` instead of Vercel URL

## CI/CD Workflow

Now that you're deployed:

1. **Development**: Work locally with `npm run dev`
2. **Testing**: Test all features locally
3. **Deployment**: `git push` to main branch
4. **Production**: Automatically deployed on Vercel
5. **Monitoring**: Check Vercel analytics and logs

## Advanced: Environment-Specific Variables

Set different values for different environments:

1. Go to **Environment Variables**
2. Click **Configure**
3. Select environment: **Production**, **Preview**, **Development**
4. Add variables specific to each

Example: Different Supabase projects for dev/prod

## Backup & Disaster Recovery

**Your data is safe because:**
- ✅ Stored in Supabase (auto-backups)
- ✅ Code on GitHub (version control)
- ✅ Deployed on Vercel (global CDN)

To recover:
1. Supabase auto-backups available for 14 days
2. Code always on GitHub
3. Can redeploy any previous version from Vercel

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Deployment](https://supabase.com/docs/guides/hosting/deployment)
- [GitHub Actions](https://github.com/features/actions) (for advanced CI/CD)

## Next Steps After Deployment

1. ✅ Test production thoroughly
2. ✅ Share public form link with users
3. ✅ Monitor analytics dashboard
4. ✅ Collect feedback from users
5. ✅ Update hospital settings (name, colors)
6. ✅ Create additional admin accounts
7. ✅ Set up alerts for errors
8. ✅ Plan feature improvements

---

**Your app is now live! 🚀**
