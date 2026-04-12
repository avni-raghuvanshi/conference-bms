# Conferra — Conference Room Booking System

A full-stack web app for booking conference rooms. Built with Next.js, Postgres, Google Calendar, and Resend.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Email Notifications](#email-notifications)
- [Google Calendar & Meet](#google-calendar--meet)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Viewing Your Data](#viewing-your-data)
- [Costs & Free Tiers](#costs--free-tiers)
- [Deployment](#deployment)

---

## How It Works

```
User fills booking form
        │
        ▼
New user? → Send OTP email (Resend) → Verify code → Issue JWT token
        │
        ▼
POST /api/bookings
        │
        ├── Save booking to Postgres (Neon via Prisma)
        ├── Create Google Calendar event + Meet link
        └── Send confirmation email to organizer + all attendees (Resend)
```

Everything runs inside a single Next.js process — there is no separate backend server.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes in one |
| Language | TypeScript (strict) | Type safety across the whole codebase |
| Database | PostgreSQL on Neon | Stores users, bookings, OTP records |
| ORM | Prisma | Type-safe DB queries, migrations, schema |
| Email | Resend | OTP codes + booking confirmation emails |
| Calendar | Google Calendar API | Creates events + Google Meet links |
| Auth | OTP + JWT (jose) | Passwordless email verification |
| Styling | Plain CSS (CSS Modules + theme tokens) | No UI libraries |

---

## Project Structure

```
conference-bms/
├── app/
│   ├── api/                        # Backend API routes
│   │   ├── auth/
│   │   │   ├── send-otp/           # POST — sends OTP email to new user
│   │   │   ├── verify-otp/         # POST — verifies code, returns JWT
│   │   │   └── check-user/         # POST — checks if email is a returning user
│   │   ├── bookings/
│   │   │   ├── route.ts            # POST — create a booking
│   │   │   └── [id]/route.ts       # GET/DELETE — single booking operations
│   │   ├── rooms/
│   │   │   ├── route.ts            # GET — list all rooms
│   │   │   ├── [id]/slots/         # GET — available time slots for a room
│   │   │   └── [id]/availability/  # GET — booked slots for a room + date
│   │   └── internal/
│   │       └── cleanup-otps/       # POST — cron job to purge expired OTP rows
│   ├── booking/                    # Booking page (room selection + form)
│   ├── confirmation/               # Post-booking confirmation page
│   └── page.tsx                    # Homepage
│
├── components/
│   ├── booking/
│   │   ├── BookingForm/            # Main booking form
│   │   ├── DatePicker/             # Date selection
│   │   ├── RoomCard/               # Room listing card
│   │   ├── TimeSlotPicker/         # Time slot grid
│   │   └── OtpModal/               # OTP verification modal
│   └── ui/
│       ├── Button/
│       ├── Header/
│       └── Input/
│
├── lib/
│   ├── api.ts                      # Client-side fetch helpers
│   ├── calendar.ts                 # Google Calendar + Meet integration
│   ├── db.ts                       # Prisma client singleton
│   ├── email.ts                    # Resend — OTP + confirmation emails
│   ├── jwt.ts                      # JWT sign/verify (OTP tokens)
│   ├── rooms.ts                    # Room definitions + time slot config
│   └── types.ts                    # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma               # Database schema (tables + relations)
│   └── migrations/                 # Auto-generated migration history
│
├── styles/
│   ├── globals.css                 # Resets, base styles, layout primitives
│   └── theme.css                   # Design tokens (colors, spacing, type scale)
│
└── .env                            # Your local secrets (never commit this)
```

---

## Database

Managed by **Prisma** and hosted on **Neon** (serverless Postgres).

### Tables

#### `User`
Stores organizer emails. A record here means the user has verified their email at least once and won't be asked for OTP again.

| Column | Type | Notes |
|---|---|---|
| id | String | cuid, primary key |
| email | String | unique |
| firstBookedAt | DateTime | when they first booked |
| createdAt | DateTime | |

#### `OtpVerification`
Temporary records for in-progress email verification. Cleaned up by a cron job.

| Column | Type | Notes |
|---|---|---|
| id | String | cuid |
| email | String | |
| otpHash | String | bcrypt hash of the 6-digit code — never stored in plain text |
| expiresAt | DateTime | 10 minutes from creation |
| usedAt | DateTime? | set when consumed — prevents reuse |
| attempts | Int | failed guess counter — blocks brute force |

#### `Booking`
Every confirmed room booking.

| Column | Type | Notes |
|---|---|---|
| id | String | cuid |
| roomId | String | matches a room in `lib/rooms.ts` |
| date | String | "YYYY-MM-DD" |
| startTime | String | "HH:MM" |
| endTime | String | "HH:MM" |
| title | String | meeting title |
| organizerEmail | String | |
| attendees | String[] | array of email addresses |
| calendarEventId | String? | Google Calendar event ID |
| meetLink | String? | Google Meet URL |
| status | Enum | CONFIRMED or CANCELLED |
| createdAt | DateTime | |

The combination of `(roomId, date, startTime)` is unique at the database level — double-booking is impossible even under concurrent requests.

### Common Prisma Commands

```bash
# Apply schema changes to the database
npx prisma migrate dev --name describe-your-change

# Open visual table browser at localhost:5555
npx prisma studio

# Regenerate the Prisma client after schema changes (usually automatic)
npx prisma generate

# Push schema without creating a migration file (quick prototyping only)
npx prisma db push
```

---

## API Endpoints

All routes live under `app/api/`. Next.js automatically exposes them as HTTP endpoints.

### Auth

| Method | Path | What it does |
|---|---|---|
| POST | `/api/auth/check-user` | Returns `{ isNewUser: boolean }` for a given email |
| POST | `/api/auth/send-otp` | Generates a 6-digit OTP, stores a hash, sends it via Resend |
| POST | `/api/auth/verify-otp` | Checks the code, marks it used, returns a signed JWT |

### Rooms

| Method | Path | What it does |
|---|---|---|
| GET | `/api/rooms` | Returns all rooms |
| GET | `/api/rooms/:id/slots` | Returns all time slots (08:00–18:00 in 1-hour blocks) |
| GET | `/api/rooms/:id/availability?date=YYYY-MM-DD` | Returns which slots are already booked |

### Bookings

| Method | Path | What it does |
|---|---|---|
| POST | `/api/bookings` | Creates a booking (requires OTP JWT for new users) |
| GET | `/api/bookings/:id` | Returns a single booking by ID |
| DELETE | `/api/bookings/:id` | Cancels a booking |

### Internal

| Method | Path | What it does |
|---|---|---|
| POST | `/api/internal/cleanup-otps` | Deletes expired OTP rows — called by a cron job, protected by `INTERNAL_CRON_SECRET` |

---

## Authentication Flow

This app uses **passwordless OTP authentication**. There are no passwords.

```
1. User enters email on booking form
2. App calls /api/auth/check-user
   ├── Returning user → skip to booking
   └── New user →
       3. App calls /api/auth/send-otp
          → 6-digit code generated
          → Hash stored in OtpVerification table
          → Plain code emailed via Resend
       4. User enters code in the OTP modal
       5. App calls /api/auth/verify-otp
          → Hash compared
          → If valid: returns a short-lived JWT (15 min)
       6. JWT is attached to the POST /api/bookings request
          as Authorization: Bearer <token>
       7. API verifies the JWT, creates the booking, saves the user
```

**Security measures:**
- OTP codes are hashed before storage (never stored in plain text)
- Codes expire after 10 minutes
- Failed attempts are counted — too many wrong guesses blocks the code
- JWT is signed with `JWT_SECRET` and expires in 15 minutes
- Slot times are validated against a whitelist — arbitrary times are rejected

---

## Email Notifications

Handled by **Resend** via `lib/email.ts`.

### OTP Email
Sent to new users during email verification. Contains a 6-digit code, valid for 10 minutes.

### Booking Confirmation Email
Sent to the organizer and all attendees after a successful booking. Includes:
- Meeting title and booking reference ID
- Room name and floor
- Date and time
- Attendee list
- Google Meet link (if generated)

---

## Google Calendar & Meet

Handled by `lib/calendar.ts` using a **Google Service Account** with Domain-Wide Delegation.

After a booking is confirmed:
1. A Calendar event is created on `reservations@conferra.co`
2. A Google Meet link is generated and attached to the event
3. Invites are sent to all attendees via Google (`sendUpdates: 'all'`)
4. The event ID and Meet link are saved back to the `Booking` row

**If Calendar fails**, the booking is still confirmed. The error is logged and the app continues — Calendar is non-critical.

### Setup Requirements
1. Google Cloud project with Calendar API enabled
2. Service account with a JSON key
3. Domain-Wide Delegation granted with scope `https://www.googleapis.com/auth/calendar`
4. Service account added as Editor on the reservations calendar

---

## Environment Variables

Copy `.env.local.example` to `.env` and fill in your values. Never commit `.env`.

```bash
# Database — connection string from neon.tech
DATABASE_URL=""

# JWT signing secret — generate with: openssl rand -hex 32
JWT_SECRET=""

# Secret for the internal cron endpoint — generate with: openssl rand -hex 32
INTERNAL_CRON_SECRET=""

# Resend — from resend.com/api-keys
RESEND_API_KEY=""

# Google service account credentials (from the downloaded JSON key)
GOOGLE_SERVICE_ACCOUNT_EMAIL=""
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=""  # keep the \n escapes

# The Google Workspace user the service account impersonates
GOOGLE_CALENDAR_IMPERSONATE_EMAIL="reservations@conferra.co"

# The verified sender address in Resend (must match your domain) & The calendar to create events on (usually the same as above)
GOOGLE_CALENDAR_ID="reservations@conferra.co"
```

---

## Local Development

You do **not** need to start a separate backend. `npm run dev` runs everything.

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment
cp .env.local.example .env
# Fill in your values in .env

# 3. Run database migrations
npx prisma migrate dev

# 4. Start the development server
npm run dev
# → App running at http://localhost:3000

# 5. (Optional) Open visual database browser
npx prisma studio
# → Runs at http://localhost:5555
```

---

## Viewing Your Data

Run Prisma Studio in a second terminal while the app is running:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`. You can:
- Browse every table and row
- Filter, sort, and search records
- Edit or delete individual rows
- No SQL required

---

## Costs & Free Tiers

| Service | What it does | Free tier | Paid starts at |
|---|---|---|---|
| **Neon** | Postgres database hosting | 0.5 GB storage, 190 compute hrs/month | $19/month |
| **Resend** | Email delivery | 3,000 emails/month, 100/day | $20/month (50k emails) |
| **Google Calendar API** | Calendar events + Meet links | Free (no meaningful limits) | Free |
| **Vercel** (optional) | Hosting + deployment | Generous hobby tier | $20/month |

For an internal company tool, you will almost certainly stay on free tiers unless usage is very high.

---

## Deployment

The easiest path is **Vercel** — it's built for Next.js and requires zero configuration.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then add all your environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

For the cron job that cleans up expired OTPs, add this to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/internal/cleanup-otps",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs the cleanup every hour. The endpoint is protected by `INTERNAL_CRON_SECRET` so only Vercel can call it.
