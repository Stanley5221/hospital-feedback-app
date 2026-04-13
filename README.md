# Hospital Feedback Web App

A comprehensive, production-ready hospital feedback management system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

✅ **Public Feedback Form**
- 5-star rating system for Service, Cleanliness, Speed, and Staff Politeness
- Optional comments textarea
- Optional photo upload
- Optional contact information (phone/email)
- Real-time validation
- Success page with redirect

✅ **Admin Dashboard**
- Secure login with Supabase Auth
- Summary statistics (total responses, overall rating, averages)
- Performance radar chart
- Recent responses preview
- Responsive sidebar navigation

✅ **Responses Management**
- Table view of all responses with sortable columns
- Search functionality (by comments/contact)
- Filter by rating level
- Expandable rows with detailed comments and photos
- Delete responses with confirmation
- Export to CSV functionality

✅ **Analytics Page**
- Feedback volume chart (last 30 days)
- Category averages bar chart
- Sentiment distribution pie chart
- Real-time data aggregation

✅ **Settings Page**
- Hospital name, tagline, and subtitle management
- Primary color customization
- Admin profile/email display
- Persistent storage in Supabase

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier available)
- Vercel account (for deployment)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. In the SQL Editor, paste the contents of `supabase/schema.sql` and execute it
4. Go to **Authentication > Providers** and ensure **Email** is enabled
5. Go to **Storage** > **Create new bucket** named `feedback-photos` and set it to **Public**
6. Go to **Settings > API** and copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Service Role Key → SUPABASE_SERVICE_ROLE_KEY

### Step 3: Configure Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Create Admin Account

1. Go to Supabase **Authentication > Users**
2. Add user with email and password
3. Use these credentials to login at `/admin/login`

### Step 5: Run Development Server

```bash
npm run dev
```

Visit:
- **Public form**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

## Deployment on Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) and import the repository
3. Add environment variables
4. Deploy

Then update Supabase **Authentication > URL Configuration**:
- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/admin/dashboard`

## Project Structure

```
app/
├── (public)/              # Public feedback form
├── admin/                 # Admin pages (protected)
│   ├── login/
│   ├── dashboard/
│   ├── responses/
│   ├── analytics/
│   └── settings/
components/
├── common/                # Shared components
└── admin/                 # Admin-only components
lib/
├── utils.ts              # Helpers & calculations
└── validation.ts         # Zod schemas
supabase/
├── client.ts             # Browser client
├── server.ts             # Server client
└── schema.sql            # Database setup
types/
└── index.ts              # TypeScript types
```

## Usage

**For Public Users:**
- Fill feedback form → Submit → See success page

**For Admins:**
- Login at `/admin/login`
- View dashboard, manage responses, analyze trends
- Update settings

## Database Tables

**feedback_responses**
- service_rating, cleanliness_rating, speed_rating, staff_politeness_rating (1-5)
- average_rating, comment, contact_info, photo_url
- sentiment (positive/neutral/negative)

**app_settings**
- hospital_name, tagline, subtitle, primary_color, logo_url

## Security

✅ Supabase Row-Level Security (RLS)
✅ Public insert-only policies for feedback
✅ Admin-only read/update/delete
✅ Zod validation on all inputs
✅ Environment variable protection

## Key Features Explained

- **Star Rating Input**: Custom 5-star component with visual feedback
- **Photo Upload**: Supabase Storage with image preview
- **Sentiment Calculation**: Auto-calculated from average rating (4+ = positive, 3 = neutral, <3 = negative)
- **CSV Export**: Download all responses as spreadsheet
- **Radar Chart**: Visual overview of all rating categories
- **Expandable Rows**: See full details without loading new page

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Supabase config error | Check .env.local has all keys |
| RLS policy error | Re-run schema.sql in Supabase |
| Login not working | Verify user in Supabase Auth |
| Photos not uploading | Check feedback-photos bucket is public |
| Charts empty | Verify data in feedback_responses table |

## Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

## License

MIT - Use freely for any purpose
