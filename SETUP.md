# Hospital Feedback System - Complete Setup Guide

This guide provides step-by-step instructions to set up, develop, and deploy the hospital feedback system.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Running the Application](#running-the-application)
4. [Admin Login Setup](#admin-login-setup)
5. [Feature Walkthrough](#feature-walkthrough)
6. [Vercel Deployment](#vercel-deployment)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)

---

## Local Development Setup

### 1. Prerequisites

Ensure you have installed:
- **Node.js** 18.0.0 or higher
- **npm** (comes with Node.js)
- A **Supabase account** (free at https://supabase.com)
- A **Vercel account** (optional, for deployment)

### 2. Clone the Project

```bash
cd hospital-feedback
npm install
```

This installs these key packages:
- `next@14` - React framework with App Router
- `supabase-js` - Supabase client
- `react-hook-form` + `zod` - Form validation
- `recharts` - Data visualization
- `lucide-react` - Icons
- `tailwindcss` - Styling

### 3. Verify Installation

```bash
npm run build
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up
2. Click **New project**
3. Choose:
   - Name: "hospital-feedback" (or any name)
   - Region: Closest to you
   - Password: Strong password (save this!)
4. Wait 2-3 minutes for initialization
5. You'll see the project dashboard

### Step 2: Create Database Tables

1. Go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy entire content from `supabase/schema.sql`:
   ```bash
   cat supabase/schema.sql
   ```
4. Paste into the SQL editor
5. Click **Run**
6. You should see:
   - ✓ CREATE TABLE worked
   - ✓ CREATE INDEX worked
   - ✓ CREATE POLICY worked

### Step 3: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **Create new bucket**
3. Name: `feedback-photos`
4. **IMPORTANT**: Enable **Public** (toggle) so anyone can upload photos
5. Click **Create**

### Step 4: Enable Email Auth

1. Go to **Authentication** > **Providers**
2. Find **Email** provider
3. Ensure it's **Enabled** (green toggle)
4. Keep the default settings

### Step 5: Get Your API Keys

1. Go to **Settings** > **API**
2. Copy these values:

   **Project URL:**
   ```
   https://xxxxx.supabase.co
   ```
   → Copy to `NEXT_PUBLIC_SUPABASE_URL`

   **Anon Key:** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   → Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   **Service Role Key:** (scroll down, be careful this is sensitive!)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   → Copy to `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT**: Never commit these keys to GitHub! Keep them in `.env.local` only.

---

## Running the Application

### Step 1: Configure Environment

Create `.env.local` in the project root:

```bash
# Copy from Supabase Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your local development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Start Development Server

```bash
npm run dev
```

Expected output:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

  ✓ Ready in 2.3s
```

### Step 3: Test the Application

Open http://localhost:3000 and you should see:
- 🏥 Hospital logo and name
- ⭐ Rating questions (1-5 stars)
- 📝 Comments box
- 🖼️ Photo upload option
- ☎️ Contact info field
- 🔵 Submit button

---

## Admin Login Setup

### Step 1: Create Admin Account

1. Open http://localhost:3000/admin/login in your browser
2. You'll see a login form (but no account yet)
3. Go to Supabase > **Authentication** > **Users**
4. Click **Add user**
5. Enter:
   - Email: `admin@hospital.com`
   - Password: `SecurePassword123!` (8+ chars, mix of upper/lower/numbers)
6. Click **Create user**

You should see the account listed in the Users table.

### Step 2: Login to Admin Panel

1. Go back to http://localhost:3000/admin/login
2. Enter:
   - Email: `admin@hospital.com`
   - Password: `SecurePassword123!`
3. Click **Login**
4. You should be redirected to `/admin/dashboard`

### Step 3: Verify Admin Access

You should now see:
- 📊 Dashboard with stat cards
- 📈 Performance radar chart
- 📅 Recent responses table
- 🔗 Sidebar with: Dashboard, Responses, Analytics, Settings, Logout

---

## Feature Walkthrough

### Public Feedback Form

**URL:** http://localhost:3000

**Features:**
- Hospital branding (customizable in Settings)
- 4 rating questions (each 1-5 stars)
- Comments box (optional)
- Expandable "Additional Options" section
  - Photo upload with preview
  - Phone/Email contact field
- Real-time validation
- Loading state while submitting
- Auto-redirect to thank you page

**To Test:**
1. Fill in ratings (1-5 for each)
2. Add a comment
3. Click "Show Additional Options"
4. Upload a photo (any image file)
5. Enter email: test@example.com
6. Click "Submit Feedback"
7. Should redirect to `/thank-you`

### Admin Dashboard

**URL:** http://localhost:3000/admin/dashboard

**Features:**
- **Stat Cards**: Total Responses, Overall Rating, Speed Average, Cleanliness
- **Radar Chart**: Shows performance across 4 categories
- **Quick Stats**: Sentiment breakdown (Positive/Neutral/Negative %)
- **Recent Responses**: Last 5 feedback items with expand feature

**To Explore:**
1. Submit several feedbacks to populate data
2. Dashboard updates automatically (may need refresh)
3. Click "View" on any response to expand and see:
   - Full comment
   - Uploaded photo preview
   - Sentiment classification

### Responses Page

**URL:** http://localhost:3000/admin/responses

**Features:**
- Full table of all responses
- **Search**: Filter by comments or contact info
- **Rating Filter**: Show only 4+ stars, 3+ stars, etc.
- **Expandable Rows**: See details without popup
- **Delete Responses**: With confirmation dialog
- **Export to CSV**: Download all data

**To Explore:**
1. Use search box (type any keyword from comments)
2. Filter by rating dropdown
3. Click "View" to expand rows and see:
   - Metrics breakdown (S/C/Sp/P)
   - Average rating
   - Comments
   - Photo preview
   - Sentiment classification
4. Click delete icon to remove response (with confirmation)
5. Click "Export CSV" to download spreadsheet

### Analytics Page

**URL:** http://localhost:3000/admin/analytics

**Features:**
- **Line Chart**: Feedback volume over last 30 days
- **Pie Chart**: Sentiment distribution (Positive/Neutral/Negative)
- **Bar Chart**: Category averages (Service/Cleanliness/Speed/Politeness)

**Charts auto-update** based on data in database. Data is calculated from:
- Last 30 days of feedback (line chart)
- Overall sentiment classification (pie chart)
- Average ratings per category (bar chart)

### Settings Page

**URL:** http://localhost:3000/admin/settings

**Features:**
- **Hospital Name**: Displayed on public form
- **Tagline**: Shown under hospital name
- **Subtitle**: Shown below tagline
- **Primary Color**: Color picker (hex format)
- **Admin Profile**: Shows logged-in email
- **Save Changes**: Persists to Supabase

**To Test:**
1. Update "Hospital Name" to something else
2. Change primary color using color picker
3. Click "Save Changes"
4. Go back to public form (`/`)
5. The hospital name should be updated!

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Hospital feedback system"

# Create repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hospital-feedback.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **New Project**
3. Select your GitHub repository
4. Click **Import**
5. **Under "Environment Variables"**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL      = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY     = eyJhbGciOi...
   NEXT_PUBLIC_APP_URL           = https://hospital-feedback-xxxxx.vercel.app
   ```
6. Click **Deploy**
7. Wait 3-5 minutes
8. You'll see **"Congratulations! Your site is live"**
9. Domain will be: `https://hospital-feedback-xxxxx.vercel.app`

### Step 3: Update Supabase Auth URLs

Now that you have a Vercel domain, update Supabase:

1. Go to Supabase > **Authentication** > **URL Configuration**
2. Update these fields:
   ```
   Site URL:
   https://hospital-feedback-xxxxx.vercel.app
   
   Redirect URLs:
   https://hospital-feedback-xxxxx.vercel.app/admin/dashboard
   https://hospital-feedback-xxxxx.vercel.app/
   ```
3. Click **Save**

### Step 4: Test Production Deployment

1. Visit `https://hospital-feedback-xxxxx.vercel.app`
2. Submit a feedback (should work)
3. Go to `https://hospital-feedback-xxxxx.vercel.app/admin/login`
4. Login with admin credentials
5. Should see all your data!

---

## Troubleshooting

### Problem: "Missing Supabase configuration"

**Cause**: `.env.local` is missing or incomplete

**Solution**:
```bash
# Check if .env.local exists
ls -la .env.local

# If not, create it:
cp .env.local.example .env.local

# Edit and add your keys
nano .env.local
```

### Problem: "RLS policy error when submitting feedback"

**Cause**: SQL schema wasn't executed properly

**Solution**:
1. Go to Supabase > **SQL Editor**
2. Click **New query**
3. Paste entire `supabase/schema.sql`
4. Click **Run**
5. Check for errors in bottom panel

### Problem: "Photo upload fails"

**Cause**: Storage bucket isn't public or doesn't exist

**Solution**:
1. Go to Supabase > **Storage**
2. Check bucket named `feedback-photos` exists
3. Click bucket name
4. Click **Edit bucket**
5. Ensure **Public** toggle is **ON** (green)
6. Click **Save**

### Problem: "Admin login says 'Invalid credentials'"

**Cause**: User doesn't exist or password is wrong

**Solution**:
1. Go to Supabase > **Authentication** > **Users**
2. Check if admin@hospital.com exists
3. If not, click **Add user** and create them
4. Try logging in again
5. Make sure Caps Lock is off!

### Problem: "Charts are empty on Analytics page"

**Cause**: No data in database yet

**Solution**:
1. Submit at least 5 feedbacks via the public form
2. Wait a few seconds
3. Refresh `/admin/analytics`
4. Charts should populate with data

### Problem: "Vercel deployment shows 500 error"

**Cause**: Missing environment variables in Vercel

**Solution**:
1. Go to Vercel project settings
2. Click **Environment Variables**
3. Verify all 4 variables are set:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_APP_URL
4. Redeploy: Click **Deployments** > **...** > **Redeploy**

### Problem: "Database connection timeout"

**Cause**: Supabase project is paused (free tier)

**Solution**:
1. Go to Supabase project
2. Click **Settings** > **Billing**
3. Enable "Auto pause" OFF (to keep always running)
4. Or upgrade to Pro if using frequently

---

## API Reference

The app uses these main Supabase tables:

### feedback_responses

**Insert (Public users):**
```typescript
supabase
  .from('feedback_responses')
  .insert({
    service_rating: 5,
    cleanliness_rating: 4,
    speed_rating: 5,
    staff_politeness_rating: 5,
    average_rating: 4.75,
    comment: 'Great service!',
    contact_info: 'user@example.com',
    photo_url: 'feedback-photos/xxxxx.jpg',
    sentiment: 'positive'
  })
```

**Read (Admins only):**
```typescript
supabase
  .from('feedback_responses')
  .select('*')
  .order('created_at', { ascending: false })
```

**Delete (Admins only):**
```typescript
supabase
  .from('feedback_responses')
  .delete()
  .eq('id', responseId)
```

### app_settings

**Read (Everyone):**
```typescript
supabase
  .from('app_settings')
  .select('*')
  .single()
```

**Update (Admins only):**
```typescript
supabase
  .from('app_settings')
  .update({ hospital_name: 'New Name' })
  .eq('id', settingsId)
```

---

## Next Steps

1. ✅ Set up local development
2. ✅ Configure Supabase
3. ✅ Test public form and admin panel
4. ✅ Deploy to Vercel
5. 📊 Customize hospital information in Settings
6. 📱 Test on mobile devices
7. 🎨 Customize colors and branding
8. 📧 Share public form link with users
9. 📈 Monitor feedback in admin panel
10. 🔐 Create additional admin accounts as needed

---

## Support

- **Supabase Issues**: https://supabase.com/docs
- **Next.js Issues**: https://nextjs.org/docs
- **Tailwind Issues**: https://tailwindcss.com/docs
- **Recharts Issues**: https://recharts.org/

Good luck! 🚀
