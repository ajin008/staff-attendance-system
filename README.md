# Staff Attendance System

A production-grade internal staff attendance management system built as a take-home assignment. Features role-based authentication, real-time check-in/checkout tracking, date-filtered attendance history, and a full admin dashboard.

---

## Features

**Admin**
- Secure login via email + password
- Create staff accounts with auto-generated Staff ID
- Edit staff details (name, email, reset password)
- Delete staff members
- View attendance for any selected date
- Today's summary — present, incomplete, absent counts with attendance rate
- Live attendance table with staff name, ID, check-in/out times, duration, status
- Staff directory with search and pagination

**Staff**
- Secure login via Staff ID + password
- Check in and check out with one click
- View today's attendance status in real time
- Attendance history

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — file-based routing, proxy rewrites, no CORS issues
- **TypeScript** — full type safety across the entire frontend
- **Tailwind CSS** — utility-first styling
- **React Hook Form** — performant form handling with validation
- **Axios** — HTTP client with request/response interceptors
- **Sonner** — toast notifications
- **use-debounce** — debounced search input (400ms)
- **react-day-picker** — accessible date picker

### Backend
- **Node.js + Express 5** — REST API server
- **TypeScript** — typed controllers, services, and repositories
- **MongoDB + Mongoose** — document database with compound indexes
- **bcryptjs** — password hashing (12 salt rounds)
- **jsonwebtoken** — JWT authentication via HTTP-only cookies
- **cookie-parser** — cookie middleware

---

## Architecture

### Backend — MVC + Service + Repository

```
routes/         → URL mapping and middleware chain
controllers/    → HTTP request/response handling only
services/       → business logic and validation
repositories/   → all MongoDB queries (single source of truth)
models/         → Mongoose schemas with indexes
middleware/     → JWT auth, role guard, async error handler
utils/          → AppError, date helpers, staffId generator
```

### Frontend — Feature-based

```
app/            → Next.js pages (login, admin, staff)
components/     → UI components per feature (admin/, staff/)
hooks/          → custom hooks (useAttendance, useStaff)
services/       → all API calls isolated
context/        → AuthContext — global auth state
types/          → TypeScript interfaces
lib/            → axios instance with interceptors
utils/          → endpoint constants
```

---

## Key Technical Decisions

**HTTP-only cookies for JWT**
Token stored in HTTP-only cookie — inaccessible to JavaScript, preventing XSS token theft. Frontend never sees the token. Axios sends it automatically on every request via `withCredentials: true`.

**MongoDB aggregation for attendance dashboard**
Attendance dashboard uses a 5-stage aggregation pipeline: `$match` filters by date first (uses index), `$lookup` joins User collection with a sub-pipeline projecting only needed fields, `$unwind` flattens the result, `$project` shapes output, `$sort` orders by check-in time. Runs entirely inside MongoDB — no application-level joins.

**Repository pattern**
All MongoDB queries isolated in repository layer. Controllers and services never import Mongoose models directly. Switching databases only requires changing repository files.

**Server-side pagination + debounced search**
Staff directory uses `skip/limit` pagination and `$regex` case-insensitive search across name, staffId, and email. Frontend debounces search input 400ms — one API call instead of one per keystroke. `Promise.all` runs data and count queries in parallel.

**Date handling**
Dates stored as UTC midnight using local timezone arithmetic (`new Date(year, month-1, day)`) to avoid IST/UTC offset issues. Date range queries use `$gte/$lte` with start-of-day and end-of-day boundaries.

**Next.js proxy rewrites**
Frontend proxies all `/api` requests to the backend via `next.config.ts` rewrites — no CORS preflight, no environment-specific base URLs in production.

---

## Database Indexes

**Users**
- `email` — unique
- `staffId` — unique

**Attendance**
- `{ userId, date }` — unique compound (one record per user per day, enforced at DB level)
- `{ date }` — admin dashboard date queries
- `{ userId }` — staff history queries

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas

### Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in your values in .env
npm run dev
```

Seed the first admin (run once):
```
POST http://localhost:8000/api/v1/auth/seed-admin
```

Default credentials after seed:
```
Email:    admin@company.com
Password: password123
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

### Backend `.env`
```
PORT=8000
MONGO_URI=mongodb://localhost:27017/staff-attendance
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env.local`
```
# no variables needed — proxy handles backend URL
```

---

## API Routes

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/v1/auth/login` | Public | Login with email or staffId |
| POST | `/api/v1/auth/logout` | Public | Clear JWT cookie |
| POST | `/api/v1/auth/seed-admin` | Public | Create first admin (once) |
| POST | `/api/v1/auth/create-staff` | Admin | Create staff account |
| GET | `/api/v1/auth/staff` | Admin | List staff (paginated + search) |
| PATCH | `/api/v1/auth/staff/:staffId` | Admin | Update staff details |
| DELETE | `/api/v1/auth/staff/:staffId` | Admin | Remove staff |

### Attendance
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/v1/attendance/check-in` | Staff | Mark check-in |
| POST | `/api/v1/attendance/check-out` | Staff | Mark check-out |
| GET | `/api/v1/attendance/today` | Staff | Own today's record |
| GET | `/api/v1/attendance/history` | Staff | Own attendance history |
| GET | `/api/v1/attendance/today/all?date=` | Admin | All staff records for date |
| GET | `/api/v1/attendance/today/summary?date=` | Admin | Summary counts for date |

---

## What I'd Add With More Time

- Refresh token rotation (currently JWT expires in 7 days)
- Leave management module
- Monthly attendance reports with export to CSV
- Email notifications for absent staff
- Push notifications for check-in reminders
- Rate limiting on auth endpoints
- Unit tests for service and repository layers
