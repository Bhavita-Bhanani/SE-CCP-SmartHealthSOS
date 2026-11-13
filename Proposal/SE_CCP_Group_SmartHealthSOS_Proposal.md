# D1 – Project Proposal and Feasibility Study

| Field | Details |
| :--- | :--- |
| **Project Title** | Smart Health & Emergency SOS Response Portal |
| **Course** | Software Engineering – CT-365 |
| **Submission** | Deliverable 1 |
| **Date** | November 14, 2026 |

### Group Members

| # | Full Name | Roll Number | Role |
| :---: | :--- | :--- | :--- |
| 1 | Bhavita Bhanani | `CT-23XXX` | Group Lead & Full-Stack Developer |
| 2 | Narjis Fatima Soomro | `CT-23XXX` | Backend & Database Architect |
| 3 | Member 3 Name | `CT-23XXX` | Frontend & UI/UX Developer |
| 4 | Member 4 Name | `CT-23XXX` | QA & Documentation Lead |

---

## 2. Problem Statement

Medical emergencies require rapid response, yet most people face critical delays due to lack of instant communication with emergency services and responders. Patients with chronic conditions or those in remote areas often cannot convey their location or medical history quickly enough in a crisis. Existing systems are either too fragmented (separate health records, separate SOS apps) or not accessible to general users.

There is a clear need for a unified, web-based portal that allows users to:
- Maintain a digital health profile accessible during emergencies
- Send a one-click SOS alert with real-time GPS location to registered responders and contacts
- Allow responders to track, accept, and manage ongoing emergency cases
- Allow administrators to oversee the entire system, manage users, and monitor response effectiveness

---

## 3. Project Objectives

1. Build a full-stack MERN web application for health management and emergency SOS response.
2. Implement a real-time SOS alert system using GPS and Socket.IO.
3. Provide role-based access for three distinct user types: Patient/User, Responder, and Admin.
4. Enable patients to maintain health profiles including blood type, allergies, and emergency contacts.
5. Allow responders to receive, accept, and update the status of SOS alerts.
6. Provide administrators with a monitoring dashboard for user and alert management.
7. Ensure secure, authenticated access via JWT tokens.
8. Deliver a responsive, accessible UI usable on both desktop and mobile browsers.

---

## 4. Stakeholders

| Stakeholder         | Role / Interest                                                   |
|---------------------|-------------------------------------------------------------------|
| Patient / End User  | Sends SOS alerts, manages health profile, registers contacts      |
| Responder           | First responder or medical personnel; receives and handles alerts |
| Administrator       | System manager; oversees users, alerts, and system health         |
| Emergency Contacts  | Notified via alert when a user sends SOS                          |
| Development Team    | Designs, builds, and tests the portal                             |
| Course Instructor   | Evaluates engineering process and deliverables                    |

---

## 5. Project Scope

### In Scope
- User registration and login with role-based access (Patient, Responder, Admin)
- Health profile creation and management (blood type, allergies, medical history, emergency contacts)
- Real-time SOS alert with GPS coordinates broadcast to responders
- Responder dashboard: view active alerts, accept/close cases, view patient location on map
- Admin dashboard: manage users, view all alerts, deactivate accounts
- Real-time communication via Socket.IO
- JWT-based authentication and bcrypt password hashing
- Responsive web UI using React.js and Tailwind CSS

### Out of Scope
- Native mobile app (iOS/Android)
- SMS/email notification gateway (planned as future enhancement)
- AI-based emergency detection
- Integration with government emergency services APIs
- Payment processing

---

## 6. Assumptions

1. Users have access to a modern web browser with Geolocation API support.
2. The application will be run locally or on a university server for demonstration purposes.
3. MongoDB will be run locally or via MongoDB Atlas for the prototype.
4. Responders are pre-registered by the administrator.
5. Internet connectivity is available for real-time features.
6. Google Maps links are shared via the alert; full Maps SDK integration is considered an enhancement.

---

## 7. Constraints

| Constraint          | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| Time                | Must be completed within the semester timeline                     |
| Team Size           | Small team of 3–4 members                                          |
| Technology          | MERN stack (mandated by team skill set and project scope)          |
| Budget              | No budget; uses free tiers (MongoDB Atlas free, local Node.js)     |
| Scope               | Core prototype only; advanced integrations are future enhancements |

---

## 8. Feasibility Analysis

### 8.1 Technical Feasibility
The MERN stack is well-documented and widely used. All required libraries (Socket.IO, JWT, Mongoose, React, Tailwind CSS) are open-source and freely available. The browser Geolocation API provides GPS data without external cost. The team has adequate familiarity with JavaScript and web development. **Verdict: Feasible.**

### 8.2 Operational Feasibility
The portal addresses a real, well-understood need. The UI is designed to be simple and fast — critical in emergency scenarios. Role separation ensures the right people see the right information. **Verdict: Feasible.**

### 8.3 Schedule Feasibility
The project is divided into six deliverables aligned to course milestones. Using an Agile/Scrum-inspired approach with two-week sprints, the core prototype can be completed within the semester. **Verdict: Feasible with discipline.**

### 8.4 Economic Feasibility
All technologies are free and open-source. Hosting is local for the prototype. No paid APIs are required for the core features. **Verdict: Fully feasible at zero cost.**

---

## 9. Risk Analysis

| Risk                              | Likelihood | Impact | Mitigation                                           |
|-----------------------------------|------------|--------|------------------------------------------------------|
| GPS not available in browser      | Low        | High   | Provide manual location input as fallback            |
| Real-time Socket.IO issues        | Medium     | High   | Test early; fall back to polling if needed           |
| Team member unavailability        | Medium     | Medium | Cross-train team; document all work in Git           |
| MongoDB Atlas connectivity issues | Low        | Medium | Use local MongoDB as backup                          |
| Scope creep                       | Medium     | Medium | Strictly follow approved scope; defer enhancements   |
| Data security / privacy concerns  | Low        | High   | Use JWT, bcrypt, HTTPS, and input sanitization       |

---

## 10. Selected SDLC Model: Agile (Scrum-Inspired)

**Justification:**
- Requirements in emergency-response systems can evolve; Agile accommodates iterative refinement.
- Short sprint cycles (2 weeks) allow early delivery of working features (SOS core first, then dashboards).
- Regular reviews ensure the prototype meets both functional and non-functional requirements.
- Suits a small team with parallel work streams (frontend, backend, testing).

**Sprint Plan Overview:**

| Sprint | Focus                                                                 |
|--------|-----------------------------------------------------------------------|
| 1      | Project setup, authentication, user registration & login             |
| 2      | Health profile management, emergency contact CRUD                    |
| 3      | SOS alert system, GPS capture, Socket.IO real-time broadcast         |
| 4      | Responder dashboard, alert accept/close workflow                     |
| 5      | Admin dashboard, user management, alert monitoring                   |
| 6      | Testing, bug fixes, documentation, final report & presentation       |
