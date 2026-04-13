# Hospital Feedback System - URLs & Endpoints Reference

## Development URLs (Local)

### Public Pages
| Page | URL | Purpose |
|------|-----|---------|
| Feedback Form | http://localhost:3000 | Patient feedback submission |
| Thank You | http://localhost:3000/thank-you | Confirmation after submission |

### Admin Pages (Protected)
| Page | URL | Purpose |
|------|-----|---------|
| Login | http://localhost:3000/admin/login | Admin authentication |
| Dashboard | http://localhost:3000/admin/dashboard | Overview & statistics |
| Responses | http://localhost:3000/admin/responses | All feedback responses |
| Analytics | http://localhost:3000/admin/analytics | Data visualization |
| Settings | http://localhost:3000/admin/settings | Hospital configuration |

---

## Production URLs (After Deployment)

Replace `hospital-feedback-xxxxx` with your actual Vercel domain.

### Public Pages
| Page | URL |
|------|-----|
| Feedback Form | https://hospital-feedback-xxxxx.vercel.app |
| Thank You | https://hospital-feedback-xxxxx.vercel.app/thank-you |

### Admin Pages
| Page | URL |
|------|-----|
| Login | https://hospital-feedback-xxxxx.vercel.app/admin/login |
| Dashboard | https://hospital-feedback-xxxxx.vercel.app/admin/dashboard |
| Responses | https://hospital-feedback-xxxxx.vercel.app/admin/responses |
| Analytics | https://hospital-feedback-xxxxx.vercel.app/admin/analytics |
| Settings | https://hospital-feedback-xxxxx.vercel.app/admin/settings |

---

## API Endpoints

### Feedback Operations

**Insert Feedback** (Public)
```
Method: POST
Endpoint: Via Supabase client
Table: feedback_responses
Rules: Anyone can insert
Body: {
  service_rating: 1-5,
  cleanliness_rating: 1-5,
  speed_rating: 1-5,
  staff_politeness_rating: 1-5,
  average_rating: calculated,
  comment: text (optional),
  contact_info: email/phone (optional),
  photo_url: storage path (optional),
  sentiment: calculated
}
```

**Fetch All Feedback** (Admin Only)
```
Method: GET
Endpoint: Via Supabase client
Table: feedback_responses
Rules: Authenticated users only
Query: Order by created_at DESC
```

**Delete Feedback** (Admin Only)
```
Method: DELETE
Endpoint: Via Supabase client
Table: feedback_responses
Rules: Authenticated users only
Parameter: id (UUID)
```

---

### Settings Operations

**Fetch Settings** (Public)
```
Method: GET
Endpoint: Via Supabase client
Table: app_settings
Rules: Everyone can read
Query: Single row
```

**Update Settings** (Admin Only)
```
Method: UPDATE
Endpoint: Via Supabase client
Table: app_settings
Rules: Authenticated users only
Body: {
  hospital_name: text,
  tagline: text,
  subtitle: text,
  primary_color: hex color,
  logo_url: path (optional)
}
```

---

### File Storage

**Upload Photo** (Public)
```
Method: POST
Bucket: feedback-photos
Rules: Public access
Path: feedback-photos/{filename}
File Size: Max based on Supabase plan
```

**Get Photo URL** (Public)
```
Method: GET
Bucket: feedback-photos
Rules: Public access
URL Format: {supabase_url}/storage/v1/object/public/feedback-photos/{filename}
```

---

## Authentication Endpoints

### Sign In
```
Method: POST
Provider: Supabase Auth
Endpoint: supabase.auth.signInWithPassword()
Body: {
  email: string,
  password: string
}
Response: Session with user info
```

### Sign Out
```
Method: POST
Provider: Supabase Auth
Endpoint: supabase.auth.signOut()
Response: Success/error
```

### Get Session
```
Method: GET
Provider: Supabase Auth
Endpoint: supabase.auth.getSession()
Response: Current session or null
```

---

## Database Query Examples

### Get Total Feedback Count
```typescript
const { data, error } = await supabase
  .from('feedback_responses')
  .select('*', { count: 'exact' });
```

### Get Feedback by Date Range
```typescript
const { data, error } = await supabase
  .from('feedback_responses')
  .select('*')
  .gte('created_at', startDate)
  .lte('created_at', endDate);
```

### Get Responses with Sentiment
```typescript
const { data, error } = await supabase
  .from('feedback_responses')
  .select('*')
  .eq('sentiment', 'positive');
```

### Calculate Averages
```typescript
const avgRating = responses.reduce((sum, r) => sum + r.average_rating, 0) / responses.length;
const avgService = responses.reduce((sum, r) => sum + r.service_rating, 0) / responses.length;
```

---

## Form Data Structure

### Feedback Form Input
```typescript
{
  service_rating: 1-5,
  cleanliness_rating: 1-5,
  speed_rating: 1-5,
  staff_politeness_rating: 1-5,
  comment: string (optional),
  contact_info: email/phone (optional),
  photo: File (optional)
}
```

### Settings Form Input
```typescript
{
  hospital_name: string,
  tagline: string,
  subtitle: string,
  primary_color: string (hex #xxxxxx)
}
```

### Login Form Input
```typescript
{
  email: string (valid email),
  password: string (min 6 chars)
}
```

---

## Success Response Examples

### Feedback Submitted
```json
{
  "id": "uuid-here",
  "service_rating": 5,
  "cleanliness_rating": 4,
  "speed_rating": 5,
  "staff_politeness_rating": 5,
  "average_rating": 4.75,
  "comment": "Great service!",
  "contact_info": "user@example.com",
  "photo_url": "feedback-photos/123456.jpg",
  "sentiment": "positive",
  "created_at": "2024-04-13T10:30:00Z",
  "updated_at": "2024-04-13T10:30:00Z"
}
```

### Settings Retrieved
```json
{
  "id": "uuid-here",
  "hospital_name": "Mary Queen of Love Medical Hospital, LBG",
  "tagline": "Love, Hope and Quality Health Service for all.",
  "subtitle": "Your feedback helps us improve and serve you better.",
  "logo_url": "logos/hospital-logo.png",
  "primary_color": "#3b82f6",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-04-13T10:30:00Z"
}
```

---

## Error Response Examples

### Missing Required Field
```json
{
  "error": "Validation error",
  "message": "service_rating is required"
}
```

### RLS Policy Violation
```json
{
  "error": "new row violates row-level security policy",
  "code": "42501"
}
```

### Authentication Failed
```json
{
  "error": "Invalid login credentials",
  "message": "Invalid email or password"
}
```

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Data returned |
| 201 | Created | Feedback inserted |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | No permission (RLS) |
| 404 | Not Found | Record doesn't exist |
| 500 | Server Error | Supabase error |

---

## Webhook & Notification URLs

### Supabase Webhooks (Optional Future)
- Feedback submitted
- High negative ratings
- Settings updated

Configure in Supabase > Database > Webhooks

---

## External API Integration Points

### Email Notifications (Future)
```
Service: SendGrid / Mailgun / AWS SES
Trigger: Negative feedback
Action: Notify admin
```

### SMS Notifications (Future)
```
Service: Twilio
Trigger: Critical feedback
Action: SMS alert to admin
```

### Image Processing (Future)
```
Service: ImageMagick / Cloudinary
Trigger: Photo uploaded
Action: Resize & optimize
```

---

## Rate Limiting

Currently no rate limiting implemented. For production:

### Recommended Limits
- Feedback form: 1 per IP per 30 seconds
- Login attempts: 5 per 15 minutes
- API requests: 100 per minute for admin

Configure at:
- Vercel: Middleware
- Supabase: Functions
- Vercel: Edge Functions

---

## CORS Configuration

### Allowed Origins
```
Development: http://localhost:3000
Production: https://hospital-feedback-xxxxx.vercel.app
```

### Allowed Methods
- GET
- POST
- PUT
- DELETE

### Allowed Headers
- Content-Type
- Authorization
- X-Requested-With

---

## Environment-Specific URLs

### Local Development
```
App: http://localhost:3000
Supabase JS: Uses NEXT_PUBLIC_SUPABASE_URL
Storage: {SUPABASE_URL}/storage/v1/object/public/
```

### Production (Vercel)
```
App: https://hospital-feedback-xxxxx.vercel.app
Supabase JS: Uses NEXT_PUBLIC_SUPABASE_URL
Storage: {SUPABASE_URL}/storage/v1/object/public/
```

---

## Admin Credentials

### Development
```
Email: admin@hospital.com
Password: (Set when creating user in Supabase)
```

### Production (Same)
```
Email: admin@hospital.com
Password: (Same as development or different)
```

**Note**: Create additional admin accounts in Supabase for more users

---

## Testing URLs in Browser

### Feature Test Checklist
- [ ] http://localhost:3000 - See feedback form
- [ ] Submit feedback with all ratings
- [ ] http://localhost:3000/thank-you - See success page
- [ ] http://localhost:3000/admin/login - See login form
- [ ] Login with admin credentials
- [ ] http://localhost:3000/admin/dashboard - See dashboard
- [ ] http://localhost:3000/admin/responses - See all responses
- [ ] http://localhost:3000/admin/analytics - See charts
- [ ] http://localhost:3000/admin/settings - Update settings

---

## Debug URLs

### Supabase Console
```
https://app.supabase.com
Dashboard > Project > [Project Name]
```

### Vercel Dashboard
```
https://vercel.com
Deployments > [Project Name]
```

### GitHub Repository
```
https://github.com/[USERNAME]/hospital-feedback
```

---

## Quick Navigation

| Task | URL |
|------|-----|
| Submit feedback | `/` |
| Admin login | `/admin/login` |
| View stats | `/admin/dashboard` |
| Manage responses | `/admin/responses` |
| View analytics | `/admin/analytics` |
| Update hospital info | `/admin/settings` |
| Logout | Dashboard > Logout button |

---

## Mobile URLs

All URLs work on mobile with responsive design:
```
http://localhost:3000 (mobile)
https://hospital-feedback-xxxxx.vercel.app (mobile)
```

---

**Last Updated**: 2024
**Version**: 1.0.0
