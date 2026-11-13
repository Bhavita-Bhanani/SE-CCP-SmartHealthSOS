# D5 – Test Execution Report

**Project Title:** Smart Health & Emergency SOS Response Portal  
**Course:** Software Engineering – CT-365  
**Institution:** NED University of Engineering and Technology (TIEST Campus)  
**Submission:** Deliverable 5 (Test Execution Report)  
**Execution Date:** November 13, 2026  
**Git Repository URL:** https://github.com/Bhavita-Bhanani/SE-CCP-SmartHealthSOS  

### Team Members
| Name | Roll Number | Role |
|------|-------------|------|
| Bhavita Bhanani | TCT-24007 | Team Coordinator / Backend |
| Ayesha | TCT-24009 | Frontend Developer |
| Narjis Fatima | TCT-24003 | Database / API Integration |
| Hiba Shafique | TCT-24013 | Testing & Documentation |

---

## 1. Test Execution Summary

| Metric           | Value |
|------------------|-------|
| Total Test Cases | 30    |
| Executed         | 30    |
| Passed           | 30    |
| Failed           | 0     |
| Blocked          | 0     |
| Pass Rate        | 100%  |

---

## 2. Test Execution Results

| TC ID | Test Description                    | Status | Notes                                                                 |
|-------|-------------------------------------|--------|-----------------------------------------------------------------------|
| TC-01 | Successful Registration             | Pass   | `POST /api/auth/register` returned `201`; user saved and redirected to login. |
| TC-02 | Duplicate Email Registration        | Pass   | Returned `400` with `"Email already registered"`.                     |
| TC-03 | Missing Required Fields             | Pass   | Form and schema validation blocked empty required fields (`400`/`422`). |
| TC-04 | Successful Login                    | Pass   | Verified across `patient@test.com`, `responder@test.com`, `admin@test.com` after DEF-001 fix. |
| TC-05 | Wrong Password                      | Pass   | Returned `401` with `"Invalid credentials"`.                          |
| TC-06 | Non-existent Email                  | Pass   | Returned `401` with `"Invalid credentials"`.                          |
| TC-07 | Patient → Admin RBAC Block          | Pass   | `roleGuard('admin')` returned `403 Forbidden`; UI `ProtectedRoute` redirected to `/patient`. |
| TC-08 | Responder → Admin RBAC Block        | Pass   | `roleGuard('admin')` returned `403 Forbidden` on admin routes.        |
| TC-09 | No Token Provided                   | Pass   | `protect` middleware returned `401 Unauthorized` without Bearer JWT.  |
| TC-10 | Create Health Profile               | Pass   | Saved blood type, allergies, conditions, and medications in MongoDB.  |
| TC-11 | Update Health Profile               | Pass   | `PUT /api/health` persisted updates immediately (`200 OK`).           |
| TC-12 | View Health Profile                 | Pass   | Pre-populated seeded profile (`Blood Type: B+`, `Penicillin, Peanuts`). |
| TC-13 | Add Emergency Contact               | Pass   | `POST /api/health/contacts` appended contact and updated UI list.     |
| TC-14 | Maximum 5 Contacts Boundary         | Pass   | Schema validator enforced `arr.length <= 5` and disabled 6th addition. |
| TC-15 | Add Contact with Missing Phone      | Pass   | Validation rejected missing phone number (`Contact phone is required`). |
| TC-16 | Successful SOS with GPS             | Pass   | Alert stored with `status: "pending"`, `mapsLink` auto-generated.     |
| TC-17 | SOS Broadcast Timing (≤ 3s)         | Pass   | Measured: **0.16 seconds** end-to-end via Socket.IO (`responder-room`). |
| TC-18 | SOS without GPS Permission          | Pass   | Geolocation denial triggered Manual Location Fallback (`24.8607, 67.0011`) cleanly. |
| TC-19 | Accept Alert                        | Pass   | Status updated to `"in-progress"`, `responderId` assigned, live broadcast sent. |
| TC-20 | Resolve Alert                       | Pass   | Status updated to `"resolved"` and `resolvedAt` timestamp recorded.   |
| TC-21 | Accept Already-Accepted Alert       | Pass   | Concurrent accept prevented; status check rejected duplicate claim.   |
| TC-22 | View All Users (Admin)              | Pass   | `GET /api/admin/users` returned paginated user list.                  |
| TC-23 | Deactivate User Account             | Pass   | `PATCH /api/admin/users/:userId/status` blocked subsequent login.     |
| TC-24 | Change User Role                    | Pass   | `PATCH /api/admin/users/:userId/role` updated role for next login.    |
| TC-25 | Filter Alerts by Status             | Pass   | `GET /api/admin/alerts?status=resolved` returned matching alerts only. |
| TC-26 | Filter Alerts by Date Range         | Pass   | Date range query parameters (`from`, `to`) filtered results accurately. |
| TC-27 | Logout Clears Session               | Pass   | Cleared `sos_token` from `localStorage` and redirected to `/login`.   |
| TC-28 | Tampered JWT Token                  | Pass   | `jwt.verify()` rejected altered token with `401 Invalid token`.       |
| TC-29 | NoSQL Injection Attempt             | Pass   | Input sanitization stripped `$gt` operators; login rejected safely.   |
| TC-30 | SOS Button Visibility               | Pass   | Red circular SOS button (`144×144 px`) verified on desktop and mobile viewports. |

---

## 3. Defect Log

| Defect ID | TC ID | Description | Severity | Status | Fixed In Sprint |
|-----------|-------|-------------|----------|--------|-----------------|
| DEF-001 | TC-04 | `seed.js` pre-hashed `Test@1234` with `bcrypt` before calling `User.create()`, causing double-hashing because `User.js` already hashes passwords in its `pre('save')` hook. Seeded users received `401 Invalid credentials` on login. | High | Closed | Sprint 3 |
| DEF-002 | TC-18 | Browser Geolocation API prompts are automatically blocked in private/incognito sessions without HTTPS, preventing one-click coordinate capture. Verified manual coordinate fallback form (`Karachi` / `NED-TIEST` presets) so SOS dispatch completes uninterrupted. | Medium | Closed | Sprint 3 |

---

## 4. Retest Evidence

| Defect ID | Fixed In | Retest Date | Retest Result |
|-----------|----------|-------------|---------------|
| DEF-001 | `SourceCode/backend/seed.js` (removed duplicate `bcrypt.hash` call and re-seeded MongoDB) | November 13, 2026 | **Pass** — All three seeded accounts (`patient@test.com`, `responder@test.com`, `admin@test.com`) authenticated on first attempt. |
| DEF-002 | `SourceCode/frontend/src/components/SOSButton.jsx` (verified manual coordinate fallback handler) | November 13, 2026 | **Pass** — Manual coordinate fallback dispatched SOS alert in `0.16s` with valid Google Maps URL. |

---

## 5. Limitations and Notes

- **Execution Coverage:** All 30 functional, boundary, negative, security, usability, and performance test cases from `Tests/SE_CCP_Group_SmartHealthSOS_TestPlan.md` were executed manually via Chrome/Chromium browsers and REST API verification against local MongoDB v9.0.4 (`127.0.0.1:27017`).
- **Environment Notes:** Because `localhost` runs over HTTP rather than HTTPS, incognito browser tabs deny HTML5 Geolocation by default; the manual location fallback (`TC-18`) handled this gracefully without application errors.
- **Scope Boundaries:** Automated browser UI suites (Playwright/Selenium) and high-concurrency stress testing (1,000+ simultaneous WebSockets) were outside the CT-365 project scope.

---

## 6. Conclusion

All 30 planned test cases passed with zero open Critical or High severity defects. Real-time SOS alert delivery was measured at **0.16 seconds**, exceeding the NFR-01 requirement of $\le 3.0\text{ seconds}$. Role-based access control, JWT authentication, health profile persistence, and emergency response state transitions (`pending` → `in-progress` → `resolved`) are verified and ready for final demonstration.