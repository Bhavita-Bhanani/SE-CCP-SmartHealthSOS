# D4 – Implementation and Project Tracking

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 4
**Date:** November 11, 2026
**Version:** 1.0

---

## 1. Repository Link

**Git Repository:** [Insert Repository URL]
**Branch Strategy:** `main` (stable), `dev` (active development), feature branches per sprint

---

## 2. Sprint / Iteration Plan

### Sprint 1 – Authentication & Setup
**Duration:** Week 1–2
**Goal:** Working registration, login, JWT middleware, project skeleton

| Task                                | Assigned To  | Status    |
|-------------------------------------|--------------|-----------|
| Initialize Node.js + Express backend| [Member 1]   | ✅ Done   |
| Set up MongoDB + Mongoose           | [Member 3]   | ✅ Done   |
| Implement User model                | [Member 3]   | ✅ Done   |
| Implement register endpoint         | [Member 1]   | ✅ Done   |
| Implement login endpoint + JWT      | [Member 1]   | ✅ Done   |
| Auth middleware (JWT verify)        | [Member 1]   | ✅ Done   |
| Role guard middleware               | [Member 1]   | ✅ Done   |
| Initialize React frontend           | [Member 2]   | ✅ Done   |
| Build Login and Register pages      | [Member 2]   | ✅ Done   |
| Auth context (React)                | [Member 2]   | ✅ Done   |

---

### Sprint 2 – Health Profile & Contacts
**Duration:** Week 3–4
**Goal:** Patients can manage health profiles and emergency contacts

| Task                                      | Assigned To  | Status    |
|-------------------------------------------|--------------|-----------|
| HealthProfile Mongoose model              | [Member 3]   | ✅ Done   |
| CRUD routes for health profile            | [Member 3]   | ✅ Done   |
| Health profile controller                 | [Member 3]   | ✅ Done   |
| Emergency contacts CRUD (embedded)        | [Member 3]   | ✅ Done   |
| Patient dashboard page (React)            | [Member 2]   | ✅ Done   |
| Health Profile form UI                    | [Member 2]   | ✅ Done   |
| Emergency contacts UI with max-5 guard    | [Member 2]   | ✅ Done   |

---

### Sprint 3 – SOS Alert & Real-Time
**Duration:** Week 5–6
**Goal:** One-click SOS with GPS, Socket.IO broadcast to Responders

| Task                                        | Assigned To  | Status    |
|---------------------------------------------|--------------|-----------|
| SOSAlert Mongoose model                     | [Member 3]   | ✅ Done   |
| POST /api/alert endpoint                    | [Member 1]   | ✅ Done   |
| Socket.IO server setup                      | [Member 1]   | ✅ Done   |
| Emit 'new-alert' event on SOS               | [Member 1]   | ✅ Done   |
| GPS capture via Geolocation API (frontend)  | [Member 2]   | ✅ Done   |
| Manual location fallback UI                 | [Member 2]   | ✅ Done   |
| SOS button with animation (Patient UI)      | [Member 2]   | ✅ Done   |
| Socket.IO client setup (React)              | [Member 2]   | ✅ Done   |

---

### Sprint 4 – Responder Dashboard
**Duration:** Week 7–8
**Goal:** Responders see, accept, and resolve SOS alerts in real time

| Task                                        | Assigned To  | Status    |
|---------------------------------------------|--------------|-----------|
| Responder dashboard page (React)            | [Member 2]   | ✅ Done   |
| Accept alert endpoint (PATCH status)        | [Member 1]   | ✅ Done   |
| Resolve alert endpoint                      | [Member 1]   | ✅ Done   |
| Concurrency guard (409 if already accepted) | [Member 1]   | ✅ Done   |
| View patient health profile during response | [Member 2]   | ✅ Done   |
| Socket.IO: listen for 'new-alert' events    | [Member 2]   | ✅ Done   |
| Alert card component with Maps link         | [Member 2]   | ✅ Done   |

---

### Sprint 5 – Admin Dashboard
**Duration:** Week 9–10
**Goal:** Admin can manage users and monitor all alerts

| Task                                        | Assigned To  | Status    |
|---------------------------------------------|--------------|-----------|
| Admin dashboard page (React)                | [Member 2]   | ✅ Done   |
| GET /api/admin/users (paginated)            | [Member 1]   | ✅ Done   |
| Deactivate / reactivate user                | [Member 1]   | ✅ Done   |
| Change user role                            | [Member 1]   | ✅ Done   |
| GET /api/admin/alerts (with filters)        | [Member 3]   | ✅ Done   |
| Alert filter UI (status, date range)        | [Member 2]   | ✅ Done   |
| Stats cards (total alerts, avg response)    | [Member 2]   | ✅ Done   |

---

### Sprint 6 – Testing, Bug Fixes & Docs
**Duration:** Week 11–12
**Goal:** All test cases executed, defects fixed, documentation complete

| Task                                        | Assigned To  | Status    |
|---------------------------------------------|--------------|-----------|
| Execute all 30 test cases                   | [Member 4]   | [In Progress] |
| Log and fix defects                         | All          | [In Progress] |
| Retest fixed defects                        | [Member 4]   | [In Progress] |
| Complete D1–D6 documentation                | [Member 4]   | ✅ Done   |
| Seed data script (seed.js)                  | [Member 3]   | [In Progress] |
| Prepare final presentation slides           | All          | [In Progress] |

---

## 3. Task Board

Track tasks using GitHub Issues or a Kanban board. Columns:
- **Backlog** → **In Progress** → **Review** → **Done**

GitHub Issues link: [Insert Issues URL]

---

## 4. Source Code Structure

```
SourceCode/
├── backend/
│   ├── server.js                  ← Entry point, Socket.IO init
│   ├── .env                       ← Environment variables (not committed)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   ├── alert.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── health.controller.js
│   │   ├── alert.controller.js
│   │   └── admin.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HealthProfile.js
│   │   └── SOSAlert.js
│   ├── middleware/
│   │   ├── auth.middleware.js      ← JWT verification
│   │   └── role.middleware.js      ← Role guard
│   └── seed.js                    ← Test data seeder
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── SOSButton.jsx
        │   ├── AlertCard.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── PatientDashboard.jsx
            ├── HealthProfilePage.jsx
            ├── ResponderDashboard.jsx
            └── AdminDashboard.jsx
```

---

## 5. Evidence of Incremental Development

Git commit history should demonstrate incremental work. Example commit messages:

```
feat: add User model and register endpoint (Sprint 1)
feat: implement JWT auth middleware and login route (Sprint 1)
feat: add HealthProfile model and CRUD routes (Sprint 2)
feat: implement SOS alert with GPS and Socket.IO (Sprint 3)
feat: build responder dashboard with accept/resolve (Sprint 4)
feat: add admin user management and alert monitoring (Sprint 5)
fix: handle concurrent alert acceptance with 409 guard (Sprint 4)
test: execute TC-01 to TC-15, log defects (Sprint 6)
docs: complete D1 Proposal and D2 SRS documents (Sprint 6)
```
