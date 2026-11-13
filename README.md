# ⚖️ Verdict Beach

A full-stack corporate legal services website for **Verdict Beach**, the legal services vertical of Belvo Ventures Group. It presents practice areas clearly to startups and growing businesses, and lets prospective clients submit confidential enquiries that are validated and stored in a database for the intake team.

**Live site:** https://verdict-beach-26dy.vercel.app/

---

## ✨ Features

- **Responsive marketing site** with Home, About, Services, For Businesses, and Contact pages
- **Service discovery** across Legal Assistance, Business Documentation, Agreements and Contracts, Startup Legal Support, and Compliance Services
- **Enquiry form** with client-side and server-side validation, optional file attachments (up to 5 files, 10 MB each), and submission feedback
- **Enquiry API** that validates input with Zod, stores records in MongoDB, and returns standard HTTP status codes
- **Admin enquiry management** (JWT-protected): list with pagination, search, and filters; view dashboard stats; update status and add internal notes; delete
- **Security basics:** Helmet security headers, CORS origin allowlist, and rate limiting on login
- **Centralized content** in config and data files, so copy and service details can be updated without touching components
- **Motion design** with scroll-triggered section reveals and hero transitions, with reduced-motion support

---

## 🛠️ Tech Stack

**Frontend**
- React 19, Vite 8
- React Router 7
- Tailwind CSS 3
- Framer Motion, Lucide React

**Backend**
- Node.js (ES modules), Express 4
- MongoDB with Mongoose 8
- Zod for request validation
- Helmet, CORS, express-rate-limit
- JSON Web Tokens and bcryptjs for authentication
- Multer for file uploads, Nodemailer for email notifications

---

## 📦 Installation

### 📋 Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/VerdictBeach.git
cd VerdictBeach
```

### 2️⃣ Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/verdict_beach
CLIENT_URL=http://localhost:5173

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# Optional: enables email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
NOTIFICATION_EMAIL=notifications@example.com
```

Start the server:

```bash
npm run dev     # development, with auto-reload
npm start       # production
```

The API runs at `http://localhost:5000/api`.

### 3️⃣ Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Optionally, create `frontend/.env` to point the frontend at a different API (the default is `http://localhost:5000/api`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The site runs at `http://localhost:5173`.

### 4️⃣ Build for production

```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Reference

Base URL: `/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | API status, uptime, and database connection (returns `503` if the database is down) |
| POST | `/enquiries` | Public | Submit an enquiry (JSON, or multipart form with `attachments`) |
| POST | `/auth/register` | Public | Create a user account (`role`: `admin`, `staff`, or `counsel`) |
| POST | `/auth/login` | Public | Log in and receive a JWT (rate limited) |
| GET | `/auth/me` | Bearer token | Current user profile |
| GET | `/enquiries` | Bearer token | List enquiries (`page`, `limit`, `status`, `service`, `search`, `sortBy`, `sortOrder`) |
| GET | `/enquiries/stats` | Bearer token | Totals, last 7 days, and counts by status |
| GET | `/enquiries/:id` | Bearer token | Retrieve one enquiry |
| PATCH | `/enquiries/:id` | Bearer token | Update `status` (`new`, `in_review`, `contacted`, `closed`) and/or add a `note` |
| DELETE | `/enquiries/:id` | Bearer token | Delete an enquiry |

**Example enquiry submission:**

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Rao","email":"asha@example.com","phone":"+91 98765 43210","companyName":"Example Labs","role":"Startup Founder","service":"Startup Legal Support","message":"We need help with our seed round documents."}'
```

Successful submissions return `201 Created`. Invalid payloads return `400 Bad Request`, and excessive login attempts return `429 Too Many Requests`. Management endpoints require an `Authorization: Bearer <token>` header, which you get from `/auth/login`.

---

## 📁 Folder Structure

```
VerdictBeach/
├── frontend/
│   ├── public/                    # Favicon, hero images, and background images
│   ├── src/
│   │   ├── components/            # Navbar, Footer, ContactForm, ServiceCard, animations, SVG art
│   │   ├── config/
│   │   │   └── company.js         # Company metadata, office hours, contact details
│   │   ├── data/
│   │   │   ├── content.js         # Services, values, FAQs, and page copy
│   │   │   └── heroSlides.js      # Homepage hero slides
│   │   ├── lib/
│   │   │   └── submitEnquiry.js   # API client for enquiry submission
│   │   ├── pages/                 # Home, About, Services, ForBusinesses, Contact
│   │   ├── styles/                # Global styles and Tailwind layers
│   │   ├── App.jsx                # Routing and layout shell
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/                # Database connection and environment variables
│   │   ├── controllers/           # Request handlers (auth, enquiries, health)
│   │   ├── middlewares/           # Authentication, validation, uploads, error handling
│   │   ├── models/                # Mongoose schemas (Enquiry, User)
│   │   ├── routes/                # Route definitions mounted under /api
│   │   ├── services/              # Business logic and email service
│   │   ├── utils/                 # API errors, responses, mailer
│   │   ├── validations/           # Zod validation schemas
│   │   ├── app.js                 # Express app, security, CORS, rate limiting
│   │   └── server.js              # Server entry point
│   ├── uploads/documents/         # Uploaded attachments (not committed)
│   ├── test_suite.js              # API verification script
│   └── .env.example
└── postman/                       # Postman workspace globals
```

---

## ☁️ Deployment

The frontend is deployed on Vercel at https://verdict-beach-26dy.vercel.app/. When deploying your own copy:

- Set `VITE_API_BASE_URL` to your deployed backend URL (for example `https://your-api.example.com/api`).
- Add the frontend's domain to `CLIENT_URL` on the backend so CORS allows requests from it.
- Set all secrets (`JWT_SECRET`, SMTP credentials, `MONGODB_URI`) as environment variables on the host. Never commit `.env`.

---

## 🧪 Testing

With the backend running on port 5000:

```bash
cd backend
npm test
```

The test script checks that protected routes reject unauthenticated requests, registers and logs in an admin account, and submits and manages enquiries. It creates test data in the database, so run it against a development database.


---

## 📄 License

This project is licensed under the ISC License.
