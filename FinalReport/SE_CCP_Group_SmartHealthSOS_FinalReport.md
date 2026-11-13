# D6 – Final Project Report

**Project Title:** Smart Health & Emergency SOS Response Portal  
**Course:** Software Engineering – CT-365  
**Department:** Computer Science & Information Technology, NED University of Engineering and Technology (TIEST Campus)  
**Submission Date:** November 13, 2026  
**Git Repository URL:** https://github.com/Bhavita-Bhanani/SE-CCP-SmartHealthSOS  

### Team Members
| Name | Roll Number | Role |
|------|-------------|------|
| Bhavita Bhanani | TCT-24007 | Team Coordinator / Backend |
| Ayesha | TCT-24009 | Frontend Developer |
| Narjis Fatima | TCT-24003 | Database / API Integration |
| Hiba Shafique | TCT-24013 | Testing & Documentation |

---

## 1. Executive Summary

The **Smart Health & Emergency SOS Response Portal** is a full-stack MERN web application designed to eliminate delays in emergency medical response. In critical health emergencies, bystanders and first responders often lack immediate access to a patient's exact location, blood type, drug allergies, and emergency contacts. This system bridges that gap by combining one-tap SOS alerting, browser GPS coordinate capture with manual fallback, real-time WebSocket broadcasting via Socket.IO, and role-based dashboards for **Patients**, **Responders**, and **Administrators**.

During final system verification, all 10 functional requirements (`FR-01` to `FR-10`) and 5 non-functional requirements (`NFR-01` to `NFR-05`) passed 100% of test cases (30/30), achieving an end-to-end SOS broadcast latency of **0.16 seconds** (well below the 3.0-second threshold).

---

## 2. System Overview & Architecture

The application follows a three-tier **Model–View–Controller (MVC)** client-server architecture:

1. **Presentation Layer (React.js + Tailwind CSS):** Single-page application running on `http://localhost:3000` with protected role-based routing (`PatientDashboard`, `HealthProfilePage`, `ResponderDashboard`, `AdminDashboard`) and `AuthContext` state management.
2. **Application & Real-Time Layer (Node.js + Express.js + Socket.IO):** RESTful API server on `http://localhost:5000` enforcing stateless JWT authentication (`auth.middleware.js`), role-based authorization (`role.middleware.js`), NoSQL input sanitization, and room-based WebSocket event broadcasting (`join-responder-room`, `new-alert`, `alert-updated`).
3. **Persistence Layer (MongoDB + Mongoose ODM):** Document-oriented database storing normalized collections for `Users`, `HealthProfiles` (with embedded `emergencyContacts` capped at 5), and `SOSAlerts` (with automatic Google Maps URL generation).

---

## 3. Summary of Implemented Features

- **Authentication & RBAC (`FR-01`, `FR-02`, `FR-03`, `FR-10`):** Secure user registration and login using `bcryptjs` (cost factor 10) and signed JSON Web Tokens, with strict separation between Patient, Responder, and Admin routes.
- **Health Profile & Emergency Contacts (`FR-04`, `FR-05`):** CRUD management for blood group, allergies, chronic conditions, current medications, and up to 5 emergency contacts.
- **One-Tap SOS Alerting (`FR-06`, `NFR-01`, `NFR-03`):** Prominent `144×144 px` animated SOS button capturing device GPS coordinates (`navigator.geolocation`) with an automatic manual coordinate fallback form and instant Google Maps link generation.
- **Live Responder Dispatch Board (`FR-07`):** Real-time alert queue updating without page refreshes, one-click patient medical record modal, and atomic alert lifecycle transitions (`pending` → `in-progress` → `resolved`).
- **Administrator Governance Panel (`FR-08`, `FR-09`):** Paginated user directory with role reassignment, account activation/deactivation, daily alert statistics, and multi-criteria alert filtering by status and date range.

---

## 4. Testing & Quality Assurance Summary

Testing followed the 30-case plan defined in `Tests/SE_CCP_Group_SmartHealthSOS_TestPlan.md`:
- **Total Executed:** 30 | **Passed:** 30 | **Failed:** 0 | **Pass Rate:** 100%
- **Key Defect Resolved (`DEF-001`):** Identified and fixed duplicate `bcrypt` password hashing inside `seed.js` that conflicted with the `User` model's `pre('save')` hook.
- **Performance Benchmark (`NFR-01`):** End-to-end SOS dispatch and Socket.IO broadcast completed in **0.16 seconds** against a target of $\le 3.0\text{ seconds}$.

---

## 5. Challenges Faced & Lessons Learned

- **Password Hook Synchronization:** Pre-hashing passwords in seeding scripts when Mongoose `pre('save')` middleware already performs hashing causes silent authentication mismatches. Centralizing hashing exclusively in the model layer prevents double-hashing bugs.
- **Browser Geolocation Constraints on HTTP:** Modern browsers restrict HTML5 Geolocation in private windows over non-HTTPS localhost origins. Implementing a manual coordinate fallback ensured uninterrupted emergency dispatch during demos and offline testing.
- **Real-Time State Consistency:** Combining Socket.IO push events (`new-alert`, `alert-updated`) with REST API refetches prevented stale alert states when responders claimed or resolved cases.

---

## 6. Future Enhancements

- Integration with SMS/WhatsApp gateways (e.g., Twilio) to notify embedded emergency contacts automatically when an SOS is triggered.
- Live turn-by-turn ambulance routing and responder GPS tracking on an embedded map view.
- Progressive Web App (PWA) offline caching and push notifications for mobile devices.

---

## 7. Individual Team Member Contributions

| Team Member | Roll Number | Key Contributions |
|-------------|-------------|-------------------|
| **Bhavita Bhanani** | TCT-24007 | Team Coordinator; designed system architecture, Express backend, Socket.IO real-time alert pipeline, and end-to-end integration. |
| **Ayesha** | TCT-24009 | Developed React and Tailwind CSS frontend dashboards (`PatientDashboard`, `ResponderDashboard`, `AdminDashboard`) and responsive UI components. |
| **Narjis Fatima** | TCT-24003 | Implemented MongoDB/Mongoose schemas (`User`, `HealthProfile`, `SOSAlert`), REST API endpoints, and database seeding scripts. |
| **Hiba Shafique** | TCT-24013 | Authored SRS requirements, traceability matrix, 30-case test plan, execution report, defect log, and project documentation. |