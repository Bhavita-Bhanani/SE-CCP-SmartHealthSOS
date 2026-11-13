# D5 – Test Execution Report

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 5 (Test Report)
**Date:** [Insert Execution Date]
**Tester(s):** [Insert Names]

---

## 1. Test Execution Summary

| Metric                  | Value        |
|-------------------------|--------------|
| Total Test Cases        | 30           |
| Executed                | [X]          |
| Passed                  | [X]          |
| Failed                  | [X]          |
| Blocked                 | [X]          |
| Pass Rate               | [X]%         |

---

## 2. Test Execution Results

| TC ID | Test Description                    | Status  | Notes                      |
|-------|-------------------------------------|---------|----------------------------|
| TC-01 | Successful Registration             | [Pass/Fail] |                        |
| TC-02 | Duplicate Email Registration        | [Pass/Fail] |                        |
| TC-03 | Missing Required Fields             | [Pass/Fail] |                        |
| TC-04 | Successful Login                    | [Pass/Fail] |                        |
| TC-05 | Wrong Password                      | [Pass/Fail] |                        |
| TC-06 | Non-existent Email                  | [Pass/Fail] |                        |
| TC-07 | Patient → Admin RBAC Block          | [Pass/Fail] |                        |
| TC-08 | Responder → Admin RBAC Block        | [Pass/Fail] |                        |
| TC-09 | No Token Provided                   | [Pass/Fail] |                        |
| TC-10 | Create Health Profile               | [Pass/Fail] |                        |
| TC-11 | Update Health Profile               | [Pass/Fail] |                        |
| TC-12 | View Health Profile                 | [Pass/Fail] |                        |
| TC-13 | Add Emergency Contact               | [Pass/Fail] |                        |
| TC-14 | Maximum 5 Contacts Boundary         | [Pass/Fail] |                        |
| TC-15 | Add Contact with Missing Phone      | [Pass/Fail] |                        |
| TC-16 | Successful SOS with GPS             | [Pass/Fail] |                        |
| TC-17 | SOS Broadcast Timing (≤ 3s)         | [Pass/Fail] | Measured: [X] seconds  |
| TC-18 | SOS without GPS Permission          | [Pass/Fail] |                        |
| TC-19 | Accept Alert                        | [Pass/Fail] |                        |
| TC-20 | Resolve Alert                       | [Pass/Fail] |                        |
| TC-21 | Accept Already-Accepted Alert       | [Pass/Fail] |                        |
| TC-22 | View All Users (Admin)              | [Pass/Fail] |                        |
| TC-23 | Deactivate User Account             | [Pass/Fail] |                        |
| TC-24 | Change User Role                    | [Pass/Fail] |                        |
| TC-25 | Filter Alerts by Status             | [Pass/Fail] |                        |
| TC-26 | Filter Alerts by Date Range         | [Pass/Fail] |                        |
| TC-27 | Logout Clears Session               | [Pass/Fail] |                        |
| TC-28 | Tampered JWT Token                  | [Pass/Fail] |                        |
| TC-29 | NoSQL Injection Attempt             | [Pass/Fail] |                        |
| TC-30 | SOS Button Visibility               | [Pass/Fail] |                        |

---

## 3. Defect Log

| Defect ID | TC ID  | Description                                     | Severity | Status   | Fixed In Sprint |
|-----------|--------|-------------------------------------------------|----------|----------|-----------------|
| DEF-001   |        | [Describe defect]                               | [High]   | [Open]   | [Sprint X]      |
| DEF-002   |        |                                                 |          |          |                 |

---

## 4. Retest Evidence

| Defect ID | Fixed In | Retest Date | Retest Result |
|-----------|----------|-------------|---------------|
| DEF-001   |          |             |               |

---

## 5. Limitations and Notes

- [Document any test cases that could not be executed and why]
- [Note any environment issues encountered]
- [Describe manual vs automated coverage]

---

## 6. Conclusion

[Summarize overall quality, known issues remaining, and readiness for final demo.]
