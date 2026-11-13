# D6 – Final Report

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 6 – Final Report
**Date:** [Insert Final Submission Date]
**Git Repository:** [Insert URL]

---

## Cover Page

| Field              | Details                                              |
|--------------------|------------------------------------------------------|
| Project Title      | Smart Health & Emergency SOS Response Portal         |
| Course             | Software Engineering – CT-365                        |
| Team Members       | [Name – Roll No.], [Name – Roll No.], ...            |
| Submission Date    | [Insert Date]                                        |
| Git Repository URL | [Insert URL]                                         |

---

## Table of Contents

1. Executive Summary
2. Project Overview
3. Requirements Summary
4. System Design Summary
5. Implementation Overview
6. Testing Summary
7. Installation and Setup Guide
8. User Guide
9. Individual Contribution Statements
10. Lessons Learned and Limitations
11. References

---

## 1. Executive Summary

The Smart Health & Emergency SOS Response Portal is a full-stack web application developed as part of the CT-365 Software Engineering course. It addresses the critical gap between patients in emergency situations and the responders who can help them, by providing:

- A one-click SOS alert system with real-time GPS location sharing
- Role-based access for Patients, Responders, and Administrators
- Health profile management to give responders vital medical information instantly
- A real-time responder dashboard powered by Socket.IO

The project was developed over [X] weeks using an Agile (Scrum-inspired) approach across [X] sprints, delivering a fully functional prototype that meets all core approved requirements.

---

## 2. Project Overview

### 2.1 Problem Statement
Medical emergencies require instant, accurate information exchange. Existing solutions are either too fragmented or inaccessible. This portal unifies health data and emergency signaling into a single, easy-to-use platform.

### 2.2 Objectives Achieved

| Objective                                    | Status      |
|----------------------------------------------|-------------|
| Role-based access (Patient, Responder, Admin)| ✅ Complete |
| Real-time SOS alert with GPS                 | ✅ Complete |
| Health profile management                    | ✅ Complete |
| Emergency contact management                 | ✅ Complete |
| Responder dashboard with live alerts         | ✅ Complete |
| Admin user and alert management              | ✅ Complete |
| JWT authentication and bcrypt security       | ✅ Complete |
| Responsive UI                                | ✅ Complete |

### 2.3 SDLC Model Used
Agile (Scrum-inspired) with [X] two-week sprints. Rationale is documented in the Proposal (D1).

---

## 3. Requirements Summary

A total of **10 functional requirements** and **5 non-functional requirements** were defined in the SRS (D2).

- All High-priority FRs (FR-01 through FR-07) are implemented and tested.
- Medium-priority FRs (FR-08, FR-09, FR-10) are implemented.
- All 5 NFRs were addressed in design and verified during testing.

Full requirements are documented in `SRS/SE_CCP_Group_SmartHealthSOS_SRS.md`.

---

## 4. System Design Summary

The system follows a 3-tier MVC architecture on the MERN stack:
- **Frontend:** React.js with Tailwind CSS, organized into pages and reusable components
- **Backend:** Node.js + Express.js with separated routes, controllers, and middleware
- **Database:** MongoDB with Mongoose ODM; three collections: `users`, `healthprofiles`, `sosalerts`
- **Real-time:** Socket.IO for instant SOS broadcast to Responders

Full design documentation, UML diagrams, ER diagram, and wireframes are in `Design/SE_CCP_Group_SmartHealthSOS_Design.md`.

---

## 5. Implementation Overview

### 5.1 Sprint Summary

| Sprint | Features Delivered                                         |
|--------|------------------------------------------------------------|
| 1      | Project setup, authentication (register, login, JWT)      |
| 2      | Health profile CRUD, emergency contact management         |
| 3      | SOS alert system, GPS capture, Socket.IO broadcast        |
| 4      | Responder dashboard, alert accept/resolve workflow        |
| 5      | Admin dashboard, user management, alert monitoring        |
| 6      | Testing, bug fixes, documentation, final report           |

### 5.2 Key Technical Implementations

**Real-time SOS Broadcasting:**
Socket.IO server emits a `new-alert` event when a Patient sends SOS. All connected Responders receive the alert instantly with patient name, GPS coordinates, Maps link, blood type, and timestamp.

**JWT Role Middleware:**
Every protected API route passes through `authMiddleware` which verifies the token, then `roleGuard(role)` which enforces role-specific access.

**Health Profile:**
Stored as a separate MongoDB document linked to the user by `userId`. Emergency contacts are embedded as an array for fast retrieval.

### 5.3 Repository Link
[Insert Git Repository URL here]

---

## 6. Testing Summary

- **30 test cases** defined across functional, boundary, negative, role/permission, security, and performance categories.
- All test cases mapped to requirements in the RTM.
- [X] passed, [X] failed (all fixed), [X] deferred.
- Performance: SOS broadcast delivered to Responder in [X] seconds (target ≤ 3s).

Full test plan: `Tests/SE_CCP_Group_SmartHealthSOS_TestPlan.md`
Test report: `TestReports/SE_CCP_Group_SmartHealthSOS_TestReport.md`

---

## 7. Installation and Setup Guide

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- npm

### Step 1 – Clone Repository
```bash
git clone [REPOSITORY_URL]
cd CCP_Group_SmartHealthSOS/SourceCode
```

### Step 2 – Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```
MONGO_URI=mongodb://127.0.0.1:27017/smartHealthSOS
JWT_SECRET=your_secure_secret_here
PORT=5000
```
```bash
node server.js
```
Backend runs on: `http://localhost:5000`

### Step 3 – Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

### Step 4 – Seed Test Data (Optional)
```bash
cd backend
node seed.js
```
This creates sample users (patient, responder, admin) using data from `InputData/sample_data.json`.

---

## 8. User Guide

### Patient
1. Register at `/register`, select role "Patient"
2. Log in and complete your Health Profile (blood type, allergies, contacts)
3. In an emergency, press the large red **SOS** button on your dashboard
4. Confirm the GPS location prompt; your alert is sent instantly to all online Responders

### Responder
1. Log in with a Responder account (registered by Admin)
2. Your dashboard shows all active SOS alerts in real time
3. Click **Accept** to take ownership of an alert; view the patient's health profile
4. Navigate to the patient using the Google Maps link
5. Click **Resolve** when the emergency is handled

### Admin
1. Log in with the Admin account
2. Use the **Users** tab to view, deactivate, change roles, or delete users
3. Use the **Alerts** tab to monitor all SOS alerts with filters by status and date

---

## 9. Individual Contribution Statements

| Name       | Roll No. | Contributions                                          |
|------------|----------|--------------------------------------------------------|
| [Member 1] |          | [Backend auth, SOS controller, Socket.IO setup]        |
| [Member 2] |          | [React frontend, all pages, Tailwind styling]          |
| [Member 3] |          | [Database models, health profile API, admin routes]    |
| [Member 4] |          | [Test plan, test execution, documentation, D1–D6 docs] |

---

## 10. Lessons Learned and Limitations

### Lessons Learned
- Real-time features (Socket.IO) require careful event naming and room management to avoid broadcasting to wrong clients.
- JWT middleware is best implemented as a reusable function rather than inline in each route.
- Early database schema design saves significant refactoring time later.
- Testing role-based access early exposes backend permission gaps that are hard to fix later.

### Limitations
- No SMS/email notification — emergency contacts are stored but not actively notified in this version.
- No persistent map view — location is shared as a Google Maps link, not an embedded live map.
- No mobile app — the web UI is responsive but not a dedicated native app.
- Single-server deployment — no load balancing or cloud hosting in the prototype.

---

## 11. References

1. MongoDB Documentation – https://www.mongodb.com/docs/
2. Express.js Documentation – https://expressjs.com/
3. React.js Documentation – https://react.dev/
4. Socket.IO Documentation – https://socket.io/docs/
5. JSON Web Tokens – https://jwt.io/introduction
6. Tailwind CSS Documentation – https://tailwindcss.com/docs
7. Base project reference: MDRAJAKHAN/Smart-Emergency-SoS-System – https://github.com/MDRAJAKHAN/Smart-Emergency-SoS-System
