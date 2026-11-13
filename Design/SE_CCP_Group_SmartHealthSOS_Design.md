# D3 – Analysis and Design

**Project Title:** Smart Health & Emergency SOS Response Portal
**Course:** Software Engineering – CT-365
**Submission:** Deliverable 3
**Date:** November 7, 2026
**Version:** 1.0

---

## 1. Architecture Overview

The portal follows a **3-tier MVC architecture** on the MERN stack:

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTATION TIER                   │
│        React.js + Tailwind CSS (Port 3000)          │
│   Pages: Login, Register, Patient Dashboard,        │
│          Responder Dashboard, Admin Dashboard       │
└───────────────────────┬─────────────────────────────┘
                        │ REST API (Axios) + Socket.IO
┌───────────────────────▼─────────────────────────────┐
│                 APPLICATION TIER                    │
│        Node.js + Express.js (Port 5000)             │
│   Routes → Controllers → Services                  │
│   Middleware: JWT Auth, Role Guard, Error Handler   │
│   Real-time: Socket.IO server                       │
└───────────────────────┬─────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────▼─────────────────────────────┐
│                   DATA TIER                         │
│               MongoDB Database                      │
│   Collections: users, healthprofiles, alerts        │
└─────────────────────────────────────────────────────┘
```

---

## 2. Use-Case Diagram (Textual Description)

> **Note:** Render the following in a UML tool (draw.io, Lucidchart, PlantUML) for submission.

**Actors:** Patient, Responder, Admin, System (automated)

**Use Cases:**

| Actor      | Use Case                        |
|------------|---------------------------------|
| Patient    | Register Account                |
| Patient    | Login                           |
| Patient    | Manage Health Profile           |
| Patient    | Manage Emergency Contacts       |
| Patient    | Send SOS Alert                  |
| Patient    | Logout                          |
| Responder  | Login                           |
| Responder  | View Active SOS Alerts          |
| Responder  | Accept SOS Alert                |
| Responder  | View Patient Health Profile     |
| Responder  | Resolve SOS Alert               |
| Responder  | Logout                          |
| Admin      | Login                           |
| Admin      | View All Users                  |
| Admin      | Manage User Accounts            |
| Admin      | Monitor All Alerts              |
| Admin      | Logout                          |
| System     | Broadcast SOS via Socket.IO     |
| System     | Validate JWT on Protected Route |

**Include/Extend Relationships:**
- "Send SOS Alert" **includes** "Capture GPS Location"
- "Accept SOS Alert" **includes** "View Patient Health Profile"
- "Manage User Accounts" **extends** "Deactivate Account" and "Change Role"

---

## 3. Class / Domain Diagram (Textual)

> Render in UML tool for final submission.

```
┌──────────────────────┐       ┌───────────────────────┐
│        User          │       │     HealthProfile      │
├──────────────────────┤       ├───────────────────────┤
│ _id: ObjectId        │  1  1 │ _id: ObjectId          │
│ name: String         │───────│ userId: ObjectId (ref) │
│ email: String        │       │ bloodType: String      │
│ password: String     │       │ allergies: [String]    │
│ phone: String        │       │ conditions: [String]   │
│ role: Enum           │       │ medications: [String]  │
│   (patient|responder │       │ emergencyContacts: []  │
│    |admin)           │       └───────────────────────┘
│ isActive: Boolean    │
│ createdAt: Date      │       ┌───────────────────────┐
└──────────┬───────────┘       │    EmergencyContact   │
           │                   ├───────────────────────┤
           │ 1..* alerts       │ name: String          │
           ▼                   │ phone: String         │
┌──────────────────────┐       │ relationship: String  │
│       SOSAlert       │       └───────────────────────┘
├──────────────────────┤
│ _id: ObjectId        │
│ patientId: ObjectId  │
│ latitude: Number     │
│ longitude: Number    │
│ mapsLink: String     │
│ status: Enum         │
│   (pending|          │
│    in-progress|      │
│    resolved)         │
│ responderId: ObjId   │
│ timestamp: Date      │
└──────────────────────┘
```

---

## 4. Sequence Diagram – Workflow 1: Patient Sends SOS Alert

```
Patient Browser       Frontend (React)      Backend (Express)       Responder Browser
      │                      │                      │                        │
      │── Click SOS ────────►│                      │                        │
      │                      │── GPS Request ───────►│                       │
      │                      │◄─ GPS Coords ─────────│                       │
      │                      │                      │                        │
      │                      │── POST /api/alert ──►│                        │
      │                      │   {lat, lng, token}   │                        │
      │                      │                      │── Save Alert to DB ──► │
      │                      │                      │◄─ Alert saved ─────── │
      │                      │                      │                        │
      │                      │                      │── Socket.IO emit ─────►│
      │                      │                      │   'new-alert' event    │
      │                      │                      │                        │
      │                      │◄─ 201 Created ────── │                        │
      │◄─ "SOS Sent!" ────── │                      │                        │
      │                      │                      │   Responder Dashboard  │
      │                      │                      │   updates live ───────►│
```

---

## 5. Sequence Diagram – Workflow 2: User Login and JWT Authentication

```
Client Browser        Frontend (React)      Backend (Express)       MongoDB
      │                      │                      │                   │
      │── Enter Credentials ►│                      │                   │
      │                      │── POST /api/auth/login►│                 │
      │                      │   {email, password}   │                  │
      │                      │                      │── findOne(email)─►│
      │                      │                      │◄─ User document ──│
      │                      │                      │                   │
      │                      │                      │── bcrypt.compare()│
      │                      │                      │                   │
      │                      │◄─ 200 + JWT token ── │                   │
      │                      │── store JWT ─────────►│                  │
      │◄─ Redirect to        │                      │                   │
      │   Dashboard ─────────│                      │                   │
      │                      │                      │                   │
      │── Access /dashboard ►│                      │                   │
      │                      │── GET /api/user/me ──►│                  │
      │                      │   Authorization: JWT  │                  │
      │                      │                      │── verify JWT ─────│
      │                      │◄─ 200 + user data ── │                   │
      │◄─ Dashboard loaded ──│                      │                   │
```

---

## 6. Activity Diagram – Workflow: Send SOS Alert

```
[Start]
   │
   ▼
Patient clicks SOS button
   │
   ▼
Request GPS from browser Geolocation API
   │
   ├─── GPS Available? ──── No ──► Show manual location input form
   │                                        │
   │ Yes                                    │
   ▼                                        ▼
Capture latitude & longitude        User enters location manually
   │                                        │
   └────────────────┬───────────────────────┘
                    │
                    ▼
         POST alert to backend API
                    │
                    ▼
         Validate JWT middleware
                    │
                    ├─── Valid? ── No ──► Return 401, redirect to login
                    │
                    │ Yes
                    ▼
         Save SOSAlert document to MongoDB
                    │
                    ▼
         Emit 'new-alert' event via Socket.IO
                    │
                    ▼
         All online Responders receive alert in real time
                    │
                    ▼
         Return 201 response to Patient
                    │
                    ▼
         Show "SOS Sent Successfully" confirmation
                    │
                   [End]
```

---

## 7. Database ER Diagram

```
USERS
─────────────────────────────
PK  _id          : ObjectId
    name         : String
    email        : String (unique)
    password     : String (hashed)
    phone        : String
    role         : String (patient | responder | admin)
    isActive     : Boolean
    createdAt    : Date

        │ 1
        │
        │ 1
        ▼
HEALTH_PROFILES
─────────────────────────────
PK  _id              : ObjectId
FK  userId           : ObjectId → USERS._id
    bloodType        : String
    allergies        : [String]
    chronicConditions: [String]
    medications      : [String]
    emergencyContacts: [EmergencyContact]
    updatedAt        : Date

EMERGENCY_CONTACTS (embedded in HEALTH_PROFILES)
─────────────────────────────
    name         : String
    phone        : String
    relationship : String

        │ 1 (USERS)
        │
        │ many
        ▼
SOS_ALERTS
─────────────────────────────
PK  _id          : ObjectId
FK  patientId    : ObjectId → USERS._id
FK  responderId  : ObjectId → USERS._id (nullable)
    latitude     : Number
    longitude    : Number
    mapsLink     : String
    status       : String (pending | in-progress | resolved)
    timestamp    : Date
    resolvedAt   : Date (nullable)
```

---

## 8. UI Wireframes (Descriptions)

> Detailed wireframes should be created in Figma or draw.io and attached to this document.

### 8.1 Login Page
- Centered card with email and password fields
- "Login" button (primary, full-width)
- Link to Register page
- Error message area below the form

### 8.2 Patient Dashboard
- Top navbar: logo, user name, logout button
- Large red **SOS Button** (center, minimum 80×80px) with pulsing animation
- "My Health Profile" card (shows blood type, allergies summary)
- "My Emergency Contacts" list
- "My Alert History" table (timestamp, status)

### 8.3 Responder Dashboard
- Top navbar: logo, online status indicator, logout
- "Active Alerts" panel — live-updating list of SOS cards
  - Each card: patient name, timestamp, location link, blood type, Accept button
- "My Cases" panel — alerts accepted by this responder, with Resolve button

### 8.4 Admin Dashboard
- Side navigation: Users, Alerts, Settings
- Users page: paginated table with role badge, active/inactive toggle, delete button
- Alerts page: filterable table (status, date, user), stats cards at top

---

## 9. Key Design Decisions

| Decision                       | Rationale                                                              |
|--------------------------------|------------------------------------------------------------------------|
| MERN stack                     | Unified JavaScript stack; team familiarity; large ecosystem            |
| Socket.IO for real-time alerts | Provides true push notifications; polling would increase server load   |
| JWT for authentication         | Stateless, scalable; suitable for REST APIs                            |
| bcrypt for passwords           | Industry-standard; resistant to brute force via cost factor            |
| MongoDB (document DB)          | Flexible schema suits health data with varying fields per patient      |
| Embedded emergency contacts    | Contacts belong exclusively to one profile; embedding avoids extra joins|
| MVC folder structure           | Separates concerns; enables parallel development; easy to extend       |
| Tailwind CSS                   | Utility-first; fast to build responsive UI; no extra CSS files needed  |
