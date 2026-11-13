# D5 – Test Plan and Test Cases

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 5
**Date:** November 13, 2026
**Version:** 1.0

---

## 1. Test Plan Overview

### 1.1 Objectives
- Verify that all functional requirements (FR-01 to FR-10) are correctly implemented.
- Validate non-functional requirements (NFR-01 to NFR-05).
- Identify and document defects for resolution.
- Confirm role-based access control is enforced throughout.

### 1.2 Scope
**In scope:** Unit testing of backend API endpoints, integration testing of frontend-backend flows, role/permission testing, boundary testing on input fields, and basic performance timing for the SOS broadcast.

**Out of scope:** Load testing at scale, automated end-to-end browser testing (Selenium/Playwright), and mobile device testing.

### 1.3 Testing Types Used

| Type                    | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| Functional Testing      | Verify each FR behaves as specified                          |
| Boundary Testing        | Test limits on input fields (max contacts, field lengths)    |
| Negative / Invalid Input| Confirm proper error handling for bad data                   |
| Role/Permission Testing | Verify RBAC prevents unauthorized access                     |
| Performance Testing     | Measure SOS broadcast time (target ≤ 3 seconds)             |
| Regression Testing      | Re-run affected tests after each bug fix                     |

### 1.4 Test Environment

| Component   | Detail                                   |
|-------------|------------------------------------------|
| Browser     | Google Chrome (latest), Firefox (latest) |
| Backend     | Node.js v18, Express.js, localhost:5000  |
| Frontend    | React.js, localhost:3000                 |
| Database    | MongoDB local instance                   |
| API Testing | Postman                                  |
| Test Data   | See `InputData/sample_data.json`         |

### 1.5 Entry and Exit Criteria
**Entry:** Source code is deployed locally; database is seeded with test data; all sprint features are marked complete.
**Exit:** All High-priority test cases pass; no open Critical/High severity defects; all defects logged in defect log.

---

## 2. Test Cases

### FR-01: User Registration

**TC-01 – Successful Registration**
- **Input:** name="Ali Hassan", email="ali@test.com", password="Test@1234", phone="03001234567", role="patient"
- **Expected:** 201 response; user saved in DB; redirected to login page
- **Type:** Functional

**TC-02 – Duplicate Email Registration**
- **Input:** Same email as an existing user
- **Expected:** 400 response; message "Email already registered"
- **Type:** Negative

**TC-03 – Missing Required Fields**
- **Input:** Registration with empty name field
- **Expected:** 422 response; validation error listing missing fields
- **Type:** Boundary / Negative

---

### FR-02: Login and Authentication

**TC-04 – Successful Login**
- **Input:** email="ali@test.com", password="Test@1234"
- **Expected:** 200 response; JWT token returned; redirected to patient dashboard
- **Type:** Functional

**TC-05 – Wrong Password**
- **Input:** email="ali@test.com", password="WrongPass"
- **Expected:** 401 response; message "Invalid credentials"
- **Type:** Negative

**TC-06 – Non-existent Email**
- **Input:** email="nobody@test.com", password="Test@1234"
- **Expected:** 401 response; message "Invalid credentials"
- **Type:** Negative

---

### FR-03: Role-Based Access Control

**TC-07 – Patient Cannot Access Admin Dashboard**
- **Input:** Patient JWT token used in GET /api/admin/users
- **Expected:** 403 Forbidden response
- **Type:** Role/Permission

**TC-08 – Responder Cannot Access Admin Functions**
- **Input:** Responder JWT token used in DELETE /api/admin/users/:id
- **Expected:** 403 Forbidden response
- **Type:** Role/Permission

**TC-09 – No Token Provided**
- **Input:** GET /api/health-profile with no Authorization header
- **Expected:** 401 Unauthorized response
- **Type:** Role/Permission

---

### FR-04: Health Profile Management

**TC-10 – Create Health Profile**
- **Input:** bloodType="B+", allergies=["Penicillin"], conditions=["Diabetes"]
- **Expected:** 201 response; profile saved; displayed on patient dashboard
- **Type:** Functional

**TC-11 – Update Health Profile**
- **Input:** Change bloodType from "B+" to "O+"
- **Expected:** 200 response; updated value reflected in GET response
- **Type:** Functional

**TC-12 – View Health Profile (Read)**
- **Input:** GET /api/health-profile with valid patient JWT
- **Expected:** 200 response with full profile object
- **Type:** Functional

---

### FR-05: Emergency Contact Management

**TC-13 – Add Emergency Contact**
- **Input:** name="Sara", phone="03009876543", relationship="Sister"
- **Expected:** Contact added; visible in profile
- **Type:** Functional

**TC-14 – Maximum 5 Contacts Boundary**
- **Input:** Attempt to add a 6th contact when 5 already exist
- **Expected:** 400 response; message "Maximum 5 emergency contacts allowed"
- **Type:** Boundary

**TC-15 – Add Contact with Missing Phone**
- **Input:** name="Sara", relationship="Sister" (no phone)
- **Expected:** 422 validation error; "Phone number is required"
- **Type:** Negative

---

### FR-06: Send SOS Alert

**TC-16 – Successful SOS with GPS**
- **Input:** Patient clicks SOS button; GPS returns lat=24.8607, lng=67.0011
- **Expected:** Alert saved to DB with status "pending"; Socket.IO event emitted; "SOS Sent" confirmation shown
- **Type:** Functional

**TC-17 – SOS Broadcast Timing (Performance)**
- **Input:** Responder connected via Socket.IO; Patient sends SOS
- **Expected:** Responder receives alert within 3 seconds (measured manually)
- **Type:** Performance / NFR-01

**TC-18 – SOS without GPS Permission**
- **Input:** Browser denies geolocation; patient fills manual location
- **Expected:** Alert sent with manual location; no crash
- **Type:** Negative / Boundary

---

### FR-07: Responder Alert Management

**TC-19 – Accept Alert**
- **Input:** Responder clicks "Accept" on a pending alert
- **Expected:** Alert status changes to "in-progress"; responderId set; other responders see updated status
- **Type:** Functional

**TC-20 – Resolve Alert**
- **Input:** Responder clicks "Resolve" on an in-progress alert
- **Expected:** Alert status changes to "resolved"; resolvedAt timestamp set
- **Type:** Functional

**TC-21 – Accept Already-Accepted Alert**
- **Input:** Responder 2 tries to accept alert already accepted by Responder 1
- **Expected:** 409 response; "Alert already being handled"
- **Type:** Negative

---

### FR-08: Admin User Management

**TC-22 – View All Users**
- **Input:** Admin GET /api/admin/users
- **Expected:** 200 response with paginated list (max 20 per page)
- **Type:** Functional

**TC-23 – Deactivate User Account**
- **Input:** Admin sets isActive=false for patient user
- **Expected:** 200 response; user cannot log in; receives "Account deactivated" error
- **Type:** Functional

**TC-24 – Change User Role**
- **Input:** Admin changes role of user from "patient" to "responder"
- **Expected:** 200 response; user's next login grants responder access
- **Type:** Functional

---

### FR-09: Admin Alert Monitoring

**TC-25 – Filter Alerts by Status**
- **Input:** Admin filters alerts by status="resolved"
- **Expected:** Only resolved alerts returned
- **Type:** Functional

**TC-26 – Filter by Date Range**
- **Input:** Admin filters alerts from 2026-11-01 to 2026-11-13
- **Expected:** Only alerts within that date range returned
- **Type:** Functional

---

### FR-10 / NFR-02: Logout and Security

**TC-27 – Logout Clears Session**
- **Input:** Patient clicks logout
- **Expected:** JWT removed from client; next protected route access redirects to login
- **Type:** Functional

**TC-28 – JWT Tampered Token**
- **Input:** Send a manually modified JWT in Authorization header
- **Expected:** 401 response; "Invalid token"
- **Type:** Security / NFR-02

**TC-29 – SQL/NoSQL Injection Attempt**
- **Input:** email field: `{"$gt": ""}` in login request body
- **Expected:** Sanitization middleware blocks; 400 or 422 response; no data leaked
- **Type:** Security / NFR-02

---

### NFR-03: Usability

**TC-30 – SOS Button Visibility**
- **Input:** Open patient dashboard on Chrome desktop and mobile viewport (375px width)
- **Expected:** SOS button is visible, red, minimum 60×60px on both viewports
- **Type:** Usability / NFR-03

---

## 3. Defect Log Template

Defects found during testing are recorded in `TestReports/SE_CCP_Group_SmartHealthSOS_TestReport.md`.

| Defect ID | Test Case | Description | Severity | Status | Fixed In |
|-----------|-----------|-------------|----------|--------|----------|
| DEF-001   |           |             |          |        |          |

**Severity Levels:** Critical, High, Medium, Low

---

## 4. Traceability: Test Cases to Requirements

| Test Case | Requirement | Priority |
|-----------|-------------|----------|
| TC-01–03  | FR-01       | High     |
| TC-04–06  | FR-02       | High     |
| TC-07–09  | FR-03       | High     |
| TC-10–12  | FR-04       | High     |
| TC-13–15  | FR-05       | Medium   |
| TC-16–18  | FR-06       | High     |
| TC-17     | NFR-01      | High     |
| TC-19–21  | FR-07       | High     |
| TC-22–24  | FR-08       | Medium   |
| TC-25–26  | FR-09       | Medium   |
| TC-27–29  | FR-10, NFR-02| Medium  |
| TC-28–29  | NFR-02      | High     |
| TC-30     | NFR-03      | Medium   |
