# ⚖️ Verdict Beach

A full-stack corporate legal services website for **Verdict Beach**, the legal services vertical of Belvo Ventures Group. It presents practice areas clearly to startups and growing businesses, and lets prospective clients submit confidential consultation requests that are validated, stored, and emailed to the intake team.

**Live site:** https://verdict-beach-26dy.vercel.app/

---

## ✨ Features

- **Responsive marketing site** with Home, About, Services, For Businesses, and Contact pages
- **Service discovery** across Legal Advisory, Corporate Documentation, Commercial Agreements, Startup Counsel, and Regulatory Compliance
- **Consultation enquiry form** with client-side and server-side validation, optional file attachments, and submission status feedback
- **Enquiry API** that stores records in MongoDB and sends email notifications
- **Protection against spam and abuse** through rate limiting, CORS allowlisting, and Helmet security headers
- **Admin enquiry management** endpoints (list, filter, search, update status, delete) behind JWT authentication
- **Centralized content** in config and data files, so copy and disclosures can be updated without touching components
- **Motion design** with scroll-triggered section reveals and page transitions, respecting reduced-motion preferences

---

## 🛠️ Tech Stack

**Frontend**
- React 19, Vite
- React Router 7
- Tailwind CSS 3
- Framer Motion, Lucide React

**Backend**
- Node.js, Express 4
- MongoDB with Mongoose
- Zod and express-validator for input validation
- Helmet, CORS, express-rate-limit for security
- JSON Web Tokens and bcryptjs for admin authentication
- Multer for file uploads, Nodemailer for email notifications

---

## 📦 Installation

### 📋 Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally, or a MongoDB Atlas connection string
- An SMTP account for email notifications (optional for local development)

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

### 3️⃣ Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Optionally, create `frontend/.env` to point the frontend at a different API:

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
| GET | `/health` | Public | API status, uptime, and database connectivity |
| POST | `/enquiries` | Public | Submit a consultation enquiry (JSON or multipart with attachments) |
| POST | `/auth/register` | Public | Register an admin user |
| POST | `/auth/login` | Public | Log in and receive a JWT (rate limited) |
| GET | `/auth/me` | Authenticated | Current user profile |
| GET | `/enquiries` | Authenticated | List enquiries with pagination and filters |
| GET | `/enquiries/stats` | Authenticated | Totals, recent activity, and counts by status |
| GET | `/enquiries/:id` | Authenticated | Retrieve one enquiry |
| PATCH | `/enquiries/:id` | Authenticated | Update status and notes |
| DELETE | `/enquiries/:id` | Authenticated | Delete an enquiry |

**Example request:**

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Asha Rao","email":"asha@example.com","serviceType":"startup-counsel","message":"We need help with our seed round documents."}'
```

Successful submissions return `201 Created`. Invalid payloads return `400 Bad Request`, and excessive requests return `429 Too Many Requests`.

---

## 📁 Folder Structure

```
VerdictBeach/
├── frontend/
│   ├── public/                 # Static assets (hero images, backgrounds, favicon)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ContactForm, ServiceCard, animations, SVG art
│   │   ├── config/
│   │   │   └── company.js      # Company metadata, office hours, contact details
│   │   ├── data/
│   │   │   ├── content.js      # Services, FAQs, and page copy
│   │   │   └── heroSlides.js   # Homepage hero slides
│   │   ├── lib/
│   │   │   └── submitEnquiry.js # API client for enquiry submission
│   │   ├── pages/              # Home, About, Services, ForBusinesses, Contact
│   │   ├── styles/             # Global Tailwind styles
│   │   ├── App.jsx             # Routing and layout shell
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection and environment setup
│   │   ├── controllers/        # Request handlers
│   │   ├── middlewares/        # Auth, validation, uploads, error handling
│   │   ├── models/             # Mongoose schemas (Enquiry, Consultation, User)
│   │   ├── routes/             # Route definitions
│   │   ├── services/           # Business logic and email service
│   │   ├── validations/        # Request validation schemas
│   │   ├── app.js              # Express app, CORS, security, rate limiting
│   │   └── server.js           # Server entry point
│   ├── uploads/                # Uploaded attachments (not committed)
│   ├── test_suite.js           # API test script
│   └── .env.example
├── postman/                    # Postman workspace globals
└── docs/
    └── screenshots/            # Screenshots used in this README
```



## ☁️ Deployment

The frontend is deployed on Vercel at https://verdict-beach-26dy.vercel.app/. When deploying your own copy:

- Set `VITE_API_BASE_URL` to your deployed backend URL (for example `https://your-api.example.com/api`).
- Add the frontend's domain to `CLIENT_URL` on the backend so CORS allows requests from it.
- Set all secrets (`JWT_SECRET`, SMTP credentials, `MONGODB_URI`) as environment variables on the host. Never commit `.env`.

---

## 🧪 Testing

With the backend running:

```bash
cd backend
npm test
```

The frontend was also verified manually across mobile (375px), tablet (768px), and desktop (1440px) viewports, including form validation, error handling, and production build communication with the API.

---


## 📄 License

This project is licensed under the ISC License.
