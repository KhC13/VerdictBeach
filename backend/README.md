# Verdict Beach - Backend API

Production-ready layered REST API backend for Verdict Beach, built with Node.js, Express, and MongoDB (Mongoose).

---

## 🏛 Architecture Overview

This backend is built strictly following the **3-Tier / Layered Architecture** (Separation of Concerns):

```
backend/
├── src/
│   ├── config/             # Configuration & infrastructure setup
│   │   ├── db.js           # Mongoose connection & lifecycle events
│   │   └── env.js          # Validated environment settings
│   ├── controllers/        # HTTP handlers & response serialization
│   │   ├── enquiry.controller.js
│   │   └── health.controller.js
│   ├── middlewares/        # Express middleware layer
│   │   ├── errorHandler.js # Centralized error handler
│   │   ├── notFound.js     # 404 handler
│   │   └── validate.js     # Zod schema validation runner
│   ├── models/             # Mongoose schemas & data access
│   │   ├── enquiry.model.js
│   │   └── user.model.js
│   ├── routes/             # Route mapping
│   │   ├── enquiry.routes.js
│   │   ├── health.routes.js
│   │   └── index.js
│   ├── services/           # Pure business logic layer
│   │   ├── email.service.js
│   │   └── enquiry.service.js
│   ├── utils/              # Common helpers
│   │   ├── apiError.js     # Standardized operational error class
│   │   ├── apiResponse.js  # Standardized response format
│   │   └── asyncHandler.js # Async wrapper avoiding try/catch boilerplate
│   ├── validations/        # Request payload schemas (Zod)
│   │   └── enquiry.validation.js
│   ├── app.js              # Express app setup & middleware chain
│   └── server.js           # Process entry point & graceful shutdown
├── .env.example            # Environment template
├── .env                    # Local environment config
├── .gitignore
└── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `127.0.0.1:27017` (or MongoDB Atlas connection URI)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Variables
Create `.env` (or copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/verdict_beach
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` — Checks API status, uptime, and database connectivity.

### Enquiries
- `POST /api/enquiries` — Submit an enquiry (validated with Zod, saved to MongoDB).
- `GET /api/enquiries` — List enquiries with pagination, filters (`status`, `service`, `search`).
- `GET /api/enquiries/stats` — Summary counts (total, last 7 days, grouped by status).
- `GET /api/enquiries/:id` — Retrieve an enquiry by ID.
- `PATCH /api/enquiries/:id` — Update status (`new`, `in_review`, `contacted`, `closed`) and append notes.
- `DELETE /api/enquiries/:id` — Delete an enquiry.
