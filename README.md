# JobFlow — Human-in-the-Loop AI Job Application Platform

An AI-powered job application automation platform with swipe-based job discovery, intelligent resume tailoring, cover letter generation, and one-click application submission via email.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Running the Application](#running-the-application)
- [User Flow](#user-flow)
- [API Endpoints](#api-endpoints)
- [Firebase Database Structure](#firebase-database-structure)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## Architecture

```
jobflow/
├── frontend/                      # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js              # Navigation with mobile drawer
│   │   │   ├── ProgressStepper.js     # Multi-step progress indicator
│   │   │   └── ProtectedRoute.js      # Auth guard for routes
│   │   ├── context/
│   │   │   └── AuthContext.js         # Firebase Auth provider
│   │   ├── pages/
│   │   │   ├── LoginPage.js           # Login / Signup with Google OAuth
│   │   │   ├── DashboardPage.js       # Overview dashboard with stats
│   │   │   ├── UploadPage.js          # Resume upload (PDF/DOC)
│   │   │   ├── PreferencesPage.js     # Job type, location, skills selection
│   │   │   ├── SwipePage.js           # Tinder-style job card swiping
│   │   │   ├── TailorPage.js          # AI resume tailoring + cover letter
│   │   │   ├── SubmitPage.js          # Review & submit application
│   │   │   └── ApplicationsPage.js    # Submitted applications list
│   │   ├── services/
│   │   │   ├── api.js                 # Axios API client with auth interceptor
│   │   │   └── firebase.js            # Firebase client SDK config
│   │   ├── App.js                     # Router setup
│   │   ├── index.js                   # Entry point
│   │   └── index.css                  # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
├── backend/                       # Node.js + Express API
│   ├── config/
│   │   ├── firebase.js            # Firebase Admin SDK (uses serviceAccountKey.json)
│   │   └── azure.js               # Azure OpenAI config
│   ├── middleware/
│   │   └── auth.js                # Firebase JWT token verification
│   ├── routes/
│   │   ├── jobs.js                # Job listing + recommendation engine
│   │   ├── resume.js              # Upload + PDF text extraction (stored in Realtime DB)
│   │   ├── ai.js                  # Resume tailoring + cover letter generation
│   │   ├── feedback.js            # Swipe feedback + learning data
│   │   ├── application.js         # Application submission + email trigger
│   │   └── user.js                # Preferences + profile management
│   ├── services/
│   │   ├── aiService.js           # Azure GPT-4o integration
│   │   └── emailService.js        # Nodemailer email sending
│   ├── seedJobs.js                # Seeds 15 jobs into Firebase
│   ├── server.js                  # Express entry point
│   ├── serviceAccountKey.json     # Firebase service account (YOU PROVIDE THIS)
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, Tailwind CSS, Framer Motion, Axios      |
| Backend    | Node.js, Express, Firebase Admin SDK               |
| Database   | Firebase Realtime Database                          |
| Auth       | Firebase Authentication (Email/Password + Google)   |
| AI         | Azure OpenAI GPT-4o (via Azure AI Foundry)          |
| Email      | Nodemailer (Gmail SMTP)                             |

---

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed — [download here](https://nodejs.org/)
2. **A Firebase project** with these services enabled:
   - Authentication (Email/Password + Google sign-in)
   - Realtime Database
3. **Firebase service account JSON key** (see Setup Step 2)
4. **Azure AI Foundry** project with a GPT-4o deployment
5. **Gmail account** with an App Password for sending emails

---

## Setup Guide

### Step 1: Install Dependencies

```cmd
cd backend
copy .env.example .env
npm install

cd ..\frontend
copy .env.example .env
npm install
```

### Step 2: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate new private key"**
6. Save the downloaded file as `serviceAccountKey.json` inside the `backend/` folder

### Step 3: Configure Backend `.env`

Open `backend/.env` and fill in:

```env
# Firebase (pre-configured)
FIREBASE_DATABASE_URL=https://job-application-1ce2f-default-rtdb.firebaseio.com/
FIREBASE_STORAGE_BUCKET=job-application-1ce2f.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Azure OpenAI GPT-4o
AZURE_OPENAI_API_KEY=your_azure_api_key_here

# Gmail SMTP — YOU MUST FILL THESE
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
HR_EMAIL=recipient_email@gmail.com

# Server
PORT=5000
FRONTEND_URL=http://localhost:3001
```

**How to get a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. Search for "App Passwords"
4. Create one for "Mail" → copy the 16-character password into `SMTP_PASS`

### Step 4: Configure Frontend `.env`

Open `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Enable Firebase Authentication

1. Go to Firebase Console → **Build** → **Authentication**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Enable **Google** (optional but recommended)

### Step 6: Set Firebase Realtime Database Rules

Go to Firebase Console → **Realtime Database** → **Rules** tab → paste:

```json
{
  "rules": {
    "jobs": { ".read": true, ".write": true },
    "users": { ".read": true, ".write": true },
    "feedback": { ".read": true, ".write": true },
    "applications": { ".read": true, ".write": true }
  }
}
```

Click **Publish**.

### Step 7: Seed the Database

```cmd
cd backend
node seedJobs.js
```

You should see: `Successfully seeded 15 jobs!`

---

## Running the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```cmd
cd backend
node server.js
```
You should see: `JobFlow backend running on port 5000`

**Terminal 2 — Frontend:**
```cmd
cd frontend
npm start
```
Opens automatically at `http://localhost:3000` or `http://localhost:3001`

**Important:** If the frontend starts on port 3001 instead of 3000, make sure `backend/.env` has:
```
FRONTEND_URL=http://localhost:3001
```
Then restart the backend.

---

## User Flow

1. **Sign Up / Login** — Create account with email/password or Google OAuth
2. **Upload Resume** — Upload a PDF or DOC file; text is extracted and stored
3. **Set Preferences** — Choose job types, locations, skills, and experience level
4. **Swipe Jobs** — Drag cards right (like) or left (pass) through matched jobs
5. **AI Tailor Resume** — GPT-4o rewrites your resume for the target job, highlighting changes
6. **Generate Cover Letter** — AI writes a personalized cover letter
7. **Edit** — Human-in-the-loop editing of all AI-generated content
8. **Submit** — Application email sent to HR with resume attached and cover letter in body

---

## API Endpoints

| Method | Endpoint                | Auth | Description                 |
|--------|-------------------------|------|-----------------------------|
| GET    | /api/jobs               | No   | List all jobs               |
| POST   | /api/jobs/recommend     | Yes  | Get recommended jobs        |
| GET    | /api/jobs/:id           | No   | Get single job              |
| POST   | /api/resume/upload      | Yes  | Upload resume (PDF/DOC)     |
| GET    | /api/resume             | Yes  | Get user's resume data      |
| POST   | /api/ai/tailor          | Yes  | AI tailor resume for a job  |
| POST   | /api/ai/cover-letter    | Yes  | Generate cover letter       |
| POST   | /api/ai/match           | Yes  | Get resume-job match score  |
| POST   | /api/feedback/swipe     | Yes  | Save swipe feedback         |
| POST   | /api/feedback/applied   | Yes  | Mark job as applied         |
| GET    | /api/feedback           | Yes  | Get feedback history        |
| POST   | /api/application/submit | Yes  | Submit application + email  |
| GET    | /api/application        | Yes  | List submitted applications |
| POST   | /api/user/preferences   | Yes  | Save job preferences        |
| GET    | /api/user/preferences   | Yes  | Get job preferences         |
| GET    | /api/health             | No   | Health check                |

All authenticated endpoints require header: `Authorization: Bearer <firebase_id_token>`

---

## Firebase Database Structure

```
/jobs/{jobId}                    — 15 seeded job listings
/users/{uid}/resume              — Uploaded resume (text + metadata)
/users/{uid}/preferences         — Job preferences
/users/{uid}/profile             — User profile
/users/{uid}/tailoredResumes     — AI-tailored resume history
/feedback/{uid}/{jobId}          — Swipe + application feedback
/applications/{uid}/{appId}      — Submitted applications
```

### Learning System

The feedback data at `/feedback/{uid}/{jobId}` tracks:
- `liked` — Whether the user swiped right
- `applied` — Whether they submitted an application
- `success` — Application outcome (can be updated later)

This data filters out already-seen jobs and ranks future recommendations by matching patterns in liked job types, skills, and companies.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `CORS error` in browser | Make sure `FRONTEND_URL` in backend `.env` matches the port your frontend runs on (3000 or 3001) |
| `invalid-credential` on seed | Ensure `serviceAccountKey.json` exists in `backend/` and is loaded directly in `seedJobs.js` |
| `Firebase Auth error` on login | Enable Email/Password and Google in Firebase Console → Authentication → Sign-in method |
| `AI service unavailable` | Check Azure API key is correct in `.env` and the GPT-4o deployment is active |
| Resume upload fails (500) | Check backend terminal for the specific error; ensure Realtime DB rules allow writes |
| Email bounces | `hr@example.com` is fake — set `HR_EMAIL` in `.env` to a real email address |
| `cp` not recognized | You're on Windows — use `copy` instead of `cp` |

---

## Deployment

### Frontend (Vercel / Netlify)

```cmd
cd frontend
npm run build
```
Deploy the `build/` folder. Set environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Railway / Render)

Deploy the `backend/` folder. Set all `.env` variables in the platform's environment settings. Make sure `serviceAccountKey.json` contents are provided as an environment variable or file.

---

## License

MIT
