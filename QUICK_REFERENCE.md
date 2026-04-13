# Hospital Feedback System - Quick Reference

## 🚀 Quick Start

### Development
```bash
npm install        # Install dependencies
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run lint      # Check code quality
```

### Public URLs (Local)
- **Feedback Form**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

## 📁 Key Files & Folders

| Location | Purpose |
|----------|---------|
| `app/(public)/` | Public feedback form pages |
| `app/admin/` | Admin dashboard pages |
| `components/` | Reusable React components |
| `lib/` | Utilities, validation, helpers |
| `supabase/` | Supabase configuration & schema |
| `types/` | TypeScript interfaces |
| `.env.local` | Secret credentials ⚠️ Never commit |

## 🔑 Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Tables

### feedback_responses
- `id`, `service_rating`, `cleanliness_rating`, `speed_rating`, `staff_politeness_rating`
- `average_rating`, `comment`, `contact_info`, `photo_url`, `sentiment`
- `created_at`, `updated_at`

### app_settings
- `id`, `hospital_name`, `tagline`, `subtitle`, `logo_url`, `primary_color`
- `created_at`, `updated_at`

## 🔐 Authentication

- **Public users**: Can only submit feedback
- **Admin users**: Full access to all pages
- Auth via Supabase (email + password)

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional, with React.FC or implicit typing
- **State**: React hooks (useState, useEffect)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS utility classes
- **Imports**: Use `@/` alias for clean imports

## 🧩 Component Structure

```typescript
// Import convention
import { Component } from 'react';
import { useRouter } from 'next/navigation';
import { MyComponent } from '@/components/MyComponent';

// Functional component
export default function PageName() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Setup logic
  }, [dependencies]);
  
  return (
    <div>Content</div>
  );
}
```

## 🎨 Color Scheme

- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#111827)

## 📊 Chart Conventions

- Line Chart: Feedback volume trends
- Bar Chart: Category comparisons
- Pie Chart: Sentiment distribution
- Radar Chart: Multi-metric overview

## 🔄 Data Flow

**Public Form Submission:**
1. User fills form → Form validation (Zod)
2. Submit → Upload photo to Supabase Storage
3. Calculate average rating → Determine sentiment
4. Insert into `feedback_responses` table
5. Redirect to thank you page

**Admin Access:**
1. Login with email/password → Supabase auth
2. Auth → Create session
3. Access protected pages
4. Fetch data from Supabase
5. Display in charts/tables

## 🛠️ Common Tasks

### Add New Rating Question
1. Update `FeedbackResponse` type in `types/index.ts`
2. Add column to database schema
3. Add RatingInput component to form
4. Update calculation in `lib/utils.ts`

### Change Hospital Name
1. Go to `http://localhost:3000/admin/settings`
2. Update "Hospital Name" field
3. Click "Save Changes"

### Export Response Data
1. Go to `http://localhost:3000/admin/responses`
2. Click "Export CSV" button
3. File downloads automatically

### View Submitted Photos
1. Go to Responses page
2. Click "View" on response with photo
3. Photo preview appears in expanded row

## 🐛 Debugging

### Enable Detailed Logs
```typescript
// In any component
console.log('Data:', data);
console.log('Error:', error);
```

### Check Database State
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. View `feedback_responses` and `app_settings` tables

### Test API Endpoint
```bash
curl -X GET "http://localhost:3000/api/feedback"
```

## 📱 Responsive Design

- **Mobile**: Single column, full width
- **Tablet**: 2 column grid
- **Desktop**: 3-4 column grid
- Tailwind `md:` and `lg:` breakpoints used

## ⚡ Performance Tips

- Images: Automatically optimized via Next.js
- Code: Split at page level (auto)
- Database: Indexes on `created_at`, `sentiment`, `average_rating`
- Charts: Lazy load with dynamic imports if needed

## 🔒 Security Checklist

- ✅ Row Level Security (RLS) enabled on tables
- ✅ Environment variables in `.env.local` (not committed)
- ✅ Password hashing via Supabase Auth
- ✅ HTTPS in production
- ✅ CORS restricted to origin
- ✅ Input validation with Zod

## 📚 Project Dependencies

### Core
- `next@14` - React framework
- `react@18` - UI library
- `typescript` - Type safety

### Data
- `@supabase/supabase-js` - Database & auth
- `react-hook-form` - Form state management
- `zod` - Schema validation

### UI
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `recharts` - Charts & graphs

### Development
- `eslint` - Code quality
- `@types/react` - Type definitions

## 🚢 Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase auth URLs updated
- [ ] Storage bucket set to public
- [ ] Admin account created
- [ ] Test feedback submission
- [ ] Test admin login
- [ ] Check analytics populate
- [ ] Verify photo uploads work

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Supabase help | https://supabase.com/docs |
| Next.js help | https://nextjs.org/docs |
| Tailwind help | https://tailwindcss.com/docs |
| Form help | https://react-hook-form.com/docs |
| Validation help | https://zod.dev |

## 💡 Pro Tips

1. **Local Testing**: Always test locally before pushing
2. **Git Commits**: Use meaningful commit messages
3. **Environment Variables**: Keep `.env.local` safe
4. **Database Backups**: Supabase auto-backups (14 days)
5. **Error Handling**: Check console for detailed errors
6. **Type Safety**: Enable strict TypeScript for fewer bugs
7. **Component Reuse**: Use existing components to stay consistent

## 🎯 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Missing Supabase config" | Check `.env.local` exists with all variables |
| "RLS policy error" | Run `schema.sql` in Supabase SQL editor again |
| "Photo upload fails" | Ensure `feedback-photos` bucket is public |
| "Admin login fails" | Check user exists in Supabase Auth |
| "Charts empty" | Submit test feedback to populate data |
| "Build errors" | Run `npm run build` locally to see errors |

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
