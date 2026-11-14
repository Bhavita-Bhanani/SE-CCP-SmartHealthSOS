# Smart Health & Emergency SOS Response Portal

---

## Cover Page

| Field              | Details                                              |
|--------------------|------------------------------------------------------|
| **Project Title**  | Smart Health & Emergency SOS Response Portal         |
| **Course**         | Software Engineering – CT-365                        |
| **Submission Date**| November 14, 2026                         |
| **Git Repository** | https://github.com/Bhavita-Bhanani/SE-CCP-SmartHealthSOS                           |

### Team Members

| Name               | Roll Number     | Role                        |
|--------------------|-----------------|-----------------------------|
| Bhavita         | TCT-24007      | Team Coordinator / Backend  |
| Ayesha         | TCT-24009      | Frontend Developer          |
| Narjis Fatima         | TCT-24003     | Database / API Integration  |
| Hiba Shafique         | TCT-24013      | Testing & Documentation     |

---

## Project Overview

The **Smart Health & Emergency SOS Response Portal** is a full-stack web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It enables users to send instant SOS alerts with live GPS location, manage health profiles, and allows responders and administrators to monitor and coordinate emergency responses in real time.

### Key Features

- Real-time SOS alert broadcasting with live GPS location
- Role-based access: **Patient/User**, **Responder**, **Admin**
- Health profile and medical history management
- Emergency contact management
- Real-time communication via Socket.IO
- Admin dashboard for alert monitoring and user management
- Responder dashboard for receiving and updating alert status
- Secure JWT-based authentication

---

## Technology Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React.js, Tailwind CSS, Axios           |
| Backend     | Node.js, Express.js, Socket.IO          |
| Database    | MongoDB, Mongoose                       |
| Auth        | JWT, Bcrypt.js                          |
| Maps        | Google Maps / Browser Geolocation API   |

---

## Repository Structure

```
CCP_Group_SmartHealthSOS/
├── README.md
├── Proposal/
│   └── SE_CCP_Group_SmartHealthSOS_Proposal.md
├── SRS/
│   └── SE_CCP_Group_SmartHealthSOS_SRS.md
├── Design/
│   └── SE_CCP_Group_SmartHealthSOS_Design.md
├── SourceCode/
│   ├── frontend/
│   │   ├── public/
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── context/
│   └── backend/
│       ├── routes/
│       ├── models/
│       ├── controllers/
│       └── middleware/
├── Tests/
│   └── SE_CCP_Group_SmartHealthSOS_TestPlan.md
├── TestReports/
│   └── SE_CCP_Group_SmartHealthSOS_TestReport.md
├── FinalReport/
│   └── SE_CCP_Group_SmartHealthSOS_FinalReport.md
├── Presentation/
│   └── SE_CCP_Group_SmartHealthSOS_Presentation.pptx
└── InputData/
    └── sample_data.json
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Backend Setup
```bash
cd SourceCode/backend
npm install
# Create a .env file with:
# MONGO_URI=mongodb://127.0.0.1:27017/smartHealthSOS
# JWT_SECRET=your_secret_key
# PORT=5000
node server.js
```
Backend runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd SourceCode/frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

## User Roles

| Role          | Description                                                      |
|---------------|------------------------------------------------------------------|
| **Patient/User** | Registers, manages health profile, sends SOS alerts           |
| **Responder** | Receives SOS alerts, updates response status, views location     |
| **Admin**     | Manages users, monitors all alerts, generates reports            |

---

## Documentation Index

| Deliverable | File                                                   |
|-------------|--------------------------------------------------------|
| D1 – Proposal      | `Proposal/SE_CCP_Group_SmartHealthSOS_Proposal.md`  |
| D2 – SRS           | `SRS/SE_CCP_Group_SmartHealthSOS_SRS.md`            |
| D3 – Design        | `Design/SE_CCP_Group_SmartHealthSOS_Design.md`      |
| D5 – Test Plan     | `Tests/SE_CCP_Group_SmartHealthSOS_TestPlan.md`     |
| D5 – Test Report   | `TestReports/SE_CCP_Group_SmartHealthSOS_TestReport.md` |
| D6 – Final Report  | `FinalReport/SE_CCP_Group_SmartHealthSOS_FinalReport.md` |
