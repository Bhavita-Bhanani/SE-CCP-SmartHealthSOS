# D2 – Software Requirements Specification (SRS)

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 2
**Date:** November 3, 2026
**Version:** 1.0

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Smart Health & Emergency SOS Response Portal. It serves as the agreed baseline between the development team and stakeholders and guides design, implementation, and testing.

### 1.2 Scope
The system is a web-based portal built on the MERN stack that provides real-time emergency SOS alerting, health profile management, and role-based dashboards for Patients, Responders, and Administrators.

### 1.3 Definitions

| Term             | Definition                                                        |
|------------------|-------------------------------------------------------------------|
| SOS Alert        | An emergency signal sent by a Patient with GPS coordinates        |
| Responder        | A registered first responder or medical personnel                 |
| Patient / User   | A registered individual who can send SOS alerts                   |
| Admin            | A system administrator managing users and monitoring alerts       |
| JWT              | JSON Web Token used for stateless authentication                  |
| Socket.IO        | Library enabling real-time bidirectional communication            |

---

## 2. Overall Description

### 2.1 Product Perspective
The portal is a standalone web application. It does not integrate with government emergency APIs in this version but lays the groundwork for such integrations.

### 2.2 User Classes

| User Class   | Description                                                        |
|--------------|--------------------------------------------------------------------|
| Patient      | Sends SOS, manages health profile and emergency contacts           |
| Responder    | Receives SOS alerts, updates response status                       |
| Admin        | Full system access: user management, alert monitoring, reporting   |

### 2.3 Operating Environment
- Modern web browser (Chrome, Firefox, Edge) with Geolocation API support
- Node.js v18+ on the server
- MongoDB 6+ (local or Atlas)
- Internet connection required for real-time features

---

## 3. Functional Requirements

### FR-01: User Registration
**Description:** Any user (Patient or Responder) shall be able to register with name, email, password, phone number, and role selection.
**Priority:** High
**Acceptance Criteria:**
- Registration form validates all required fields.
- Email must be unique; duplicate registration returns a clear error.
- Password is hashed with bcrypt before storage.
- On success, user is redirected to login.

---

### FR-02: User Login and Authentication
**Description:** Registered users shall log in with email and password and receive a JWT for session management.
**Priority:** High
**Acceptance Criteria:**
- Invalid credentials return a 401 error with a descriptive message.
- Successful login issues a JWT stored in localStorage/httpOnly cookie.
- Protected routes redirect unauthenticated users to the login page.

---

### FR-03: Role-Based Access Control
**Description:** The system shall enforce role-based access so that Patients, Responders, and Admins see only their respective dashboards and features.
**Priority:** High
**Acceptance Criteria:**
- A Patient cannot access the Responder or Admin dashboard.
- A Responder cannot access Admin functions.
- Attempting unauthorized access returns a 403 error.

---

### FR-04: Health Profile Management
**Description:** A Patient shall be able to create and update a health profile containing blood type, allergies, chronic conditions, current medications, and emergency contacts.
**Priority:** High
**Acceptance Criteria:**
- Health profile is pre-populated with existing data on edit.
- All fields are optional except name and blood type.
- Changes are persisted to the database immediately.

---

### FR-05: Emergency Contact Management
**Description:** A Patient shall be able to add, edit, and remove up to five emergency contacts (name, phone, relationship).
**Priority:** High
**Acceptance Criteria:**
- Maximum five contacts enforced with a UI message.
- Each contact requires at least a name and phone number.
- Contacts are displayed in the health profile view.

---

### FR-06: Send SOS Alert
**Description:** A Patient shall be able to send an SOS alert with a single button press. The system shall capture the device's GPS coordinates and broadcast the alert in real time to all online Responders.
**Priority:** High (Critical)
**Acceptance Criteria:**
- Browser Geolocation API is invoked on SOS button press.
- If GPS is unavailable, user is prompted for manual location entry.
- Alert includes: patient name, GPS coordinates, Google Maps link, timestamp, and blood type.
- Alert is broadcast to all connected Responders via Socket.IO within 3 seconds.
- Patient receives confirmation that the alert was sent.

---

### FR-07: Responder – Receive and Manage Alerts
**Description:** A Responder shall see all active SOS alerts on their dashboard in real time and shall be able to accept an alert (marking it as "In Progress") and close it (marking it as "Resolved").
**Priority:** High
**Acceptance Criteria:**
- Dashboard updates live when a new alert arrives (no page refresh needed).
- Each alert card shows patient name, location, timestamp, and health summary.
- Status transitions: Pending → In Progress → Resolved.
- Only one Responder can accept a given alert (concurrent access handled).

---

### FR-08: Admin – User Management
**Description:** An Admin shall be able to view all registered users, change user roles, deactivate/reactivate accounts, and delete users.
**Priority:** Medium
**Acceptance Criteria:**
- User list is paginated (20 per page).
- Deactivated users cannot log in and receive a clear error message.
- Role changes take effect on the user's next login.

---

### FR-09: Admin – Alert Monitoring Dashboard
**Description:** An Admin shall have a dashboard displaying all SOS alerts (past and present) with filters by status (Pending, In Progress, Resolved), date range, and user.
**Priority:** Medium
**Acceptance Criteria:**
- Filters work independently and in combination.
- Each alert entry links to full patient health profile.
- Dashboard shows aggregate stats: total alerts today, average response time.

---

### FR-10: User Logout
**Description:** Any authenticated user shall be able to log out, which invalidates their session token on the client side.
**Priority:** Medium
**Acceptance Criteria:**
- Logout clears the JWT from client storage.
- After logout, protected routes redirect to login.

---

## 4. Non-Functional Requirements

### NFR-01: Performance
The SOS alert must be broadcast to all connected Responders within **3 seconds** of the Patient pressing the SOS button under normal network conditions.
**Measurement:** Timed via browser dev tools and Socket.IO event logs during testing.

---

### NFR-02: Security
All passwords shall be hashed using **bcrypt** with a minimum cost factor of 10. All API endpoints (except register and login) shall require a valid **JWT**. The application shall sanitize all user inputs to prevent NoSQL injection.
**Measurement:** Manual code review + Postman tests hitting protected routes without tokens.

---

### NFR-03: Usability
The SOS button shall be prominently visible on the Patient dashboard (minimum 60×60 px, red color). A first-time user shall be able to send an SOS alert within **2 minutes** of registering, without any training.
**Measurement:** Usability walkthrough with a team member unfamiliar with the system.

---

### NFR-04: Availability
The system shall target **99% uptime** during the demonstration period. The backend shall implement basic error handling so that a single route failure does not crash the entire server.
**Measurement:** Manual availability checks during sprint testing.

---

### NFR-05: Scalability
The backend shall be structured using the MVC pattern with separated route, controller, and model files so that new features (e.g., SMS notifications, AI detection) can be added without refactoring core modules.
**Measurement:** Code review of project structure during D4.

---

## 5. User Stories

| ID    | As a…      | I want to…                                              | So that…                                              |
|-------|------------|---------------------------------------------------------|-------------------------------------------------------|
| US-01 | Patient    | Register an account                                     | I can access the portal                               |
| US-02 | Patient    | Log in securely                                         | My health data is protected                           |
| US-03 | Patient    | Maintain my health profile                              | Responders have my medical info in an emergency       |
| US-04 | Patient    | Add emergency contacts                                  | My family is notified when I send SOS                 |
| US-05 | Patient    | Send a one-click SOS with my GPS location               | Help reaches me as fast as possible                   |
| US-06 | Responder  | See all incoming SOS alerts in real time                | I can respond immediately without refreshing the page |
| US-07 | Responder  | Accept an alert and mark it as in progress              | Other responders know the case is being handled       |
| US-08 | Responder  | View the patient's health profile during a response     | I know about allergies and conditions before I arrive |
| US-09 | Responder  | Mark an alert as resolved                               | The system knows the emergency is over                |
| US-10 | Admin      | View and manage all registered users                    | I can maintain system integrity                       |
| US-11 | Admin      | Monitor all SOS alerts with filters                     | I can track system performance and response times     |
| US-12 | Admin      | Deactivate a user account                               | Unauthorized users cannot misuse the system           |

---

## 6. Acceptance Criteria Summary

Each FR above includes explicit acceptance criteria. The table below maps user stories to functional requirements.

| User Story | Functional Requirement |
|------------|------------------------|
| US-01      | FR-01                  |
| US-02      | FR-02, FR-10           |
| US-03      | FR-04                  |
| US-04      | FR-05                  |
| US-05      | FR-06                  |
| US-06      | FR-07                  |
| US-07      | FR-07                  |
| US-08      | FR-04, FR-07           |
| US-09      | FR-07                  |
| US-10      | FR-08                  |
| US-11      | FR-09                  |
| US-12      | FR-08                  |

---

## 7. Requirements Prioritization (MoSCoW)

| Priority    | Requirements                                   |
|-------------|------------------------------------------------|
| Must Have   | FR-01, FR-02, FR-03, FR-04, FR-06, FR-07       |
| Should Have | FR-05, FR-08, FR-10                            |
| Could Have  | FR-09                                          |
| Won't Have  | SMS/Email gateway, Mobile app, AI detection    |

---

## 8. Requirements Traceability Matrix (RTM)

| Req. ID | Description                     | User Story | Design Element           | Test Case     |
|---------|---------------------------------|------------|--------------------------|---------------|
| FR-01   | User Registration               | US-01      | AuthController.register  | TC-01         |
| FR-02   | Login & Authentication          | US-02      | AuthController.login     | TC-02, TC-03  |
| FR-03   | Role-Based Access Control       | US-02      | authMiddleware           | TC-04         |
| FR-04   | Health Profile Management       | US-03, US-08 | HealthController       | TC-05, TC-06  |
| FR-05   | Emergency Contact Management    | US-04      | HealthController         | TC-07         |
| FR-06   | Send SOS Alert                  | US-05      | AlertController, Socket  | TC-08, TC-09  |
| FR-07   | Responder Alert Management      | US-06–09   | AlertController          | TC-10, TC-11  |
| FR-08   | Admin User Management           | US-10, US-12 | AdminController        | TC-12, TC-13  |
| FR-09   | Admin Alert Monitoring          | US-11      | AdminController          | TC-14         |
| FR-10   | User Logout                     | US-02      | Frontend AuthContext     | TC-15         |
| NFR-01  | Performance – 3s alert          | US-05      | Socket.IO config         | TC-16         |
| NFR-02  | Security – bcrypt + JWT         | US-02      | authMiddleware, models   | TC-17         |
| NFR-03  | Usability – SOS button          | US-05      | PatientDashboard UI      | TC-18         |
| NFR-04  | Availability                    | All        | Error middleware          | TC-19         |
| NFR-05  | Scalability – MVC structure     | All        | Project architecture     | Code review   |
