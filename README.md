# 🏥 MedEazy — Hospital Management System (SWE Project)

MedEazy is a full-stack Hospital Management System built with the **MERN stack** as part of a **Software Engineering academic project**. It digitizes core hospital workflows across three dedicated role-based portals — **Patient**, **Doctor**, and **Admin** — covering appointment scheduling, doctor prescriptions, itemized PDF billing, medicine inventory, live video consultations, and a real-time notification system, all with secure JWT authentication and role-specific access controls.

### 🚀 What Makes MedEazy Stand Out

- 🎥 **Automated Jitsi Meet video consultation** — when a doctor sets a schedule date and time for an accepted appointment, a unique Jitsi Meet room link is **automatically generated** by the server. The video call button instantly appears on both the doctor's and patient's dashboard, and both receive a real-time notification — no manual link sharing required.
- 🔔 **Role-aware real-time notification system** — powered by Socket.io, every role receives instant, contextual notifications for events relevant only to them (bill generated, payment confirmed, video call scheduled, appointment status changed) — all delivered live without a page refresh.
- ✏️ **Admin-editable itemized billing** — before sending a bill, admins can add, edit, or remove custom line items (medicines, room charges, lab fees, etc.) in a live-edit popup, with the bill preview updating in real time. The edit option locks permanently once the bill is dispatched to the patient.
- 📄 **Professional PDF bill generation** — bills are generated client-side as branded, structured PDF documents, downloadable by both the admin (before and after sending) and the patient (after receiving).
- 💊 **Medicine inventory management** — admins can track, add, edit, and remove hospital medicine stock directly from the dashboard.

---

## 📁 Project Structure

```
Hospital_Management_System/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Node.js + Express backend
└── README.md
```

---

## ✨ Rolewise Features and WorkFlow

### 👤 Patient
- Register & login securely with JWT-based authentication
- Book appointments with available doctors by department
- View appointment status (Pending / Accepted / Rejected)
- Receive a real-time notification when a bill is generated or a video call is scheduled
- Join live video consultations via the auto-generated Jitsi Meet link
- View prescriptions written by the assigned doctor
- View & download generated bills as a branded **PDF**
- Complete dummy payment flow to simulate bill settlement

### 🩺 Doctor
- Secure doctor login portal
- Accept or reject patient appointments
- Set a schedule date and time for any appointment — a unique Jitsi Meet room link is **automatically generated** upon saving, and both the doctor and patient are notified instantly
- Join live video consultations via the auto-generated Jitsi Meet link
- Write & submit prescriptions for accepted appointments and finally mark the patient as **Checked**

### 🛠️ Admin
- Separate admin login portal
- View all assigned appointments
- View all bills and track payment statuses
- Dashboard with appointment statistics and visual charts
- Add new doctors and admins to the system
- Generate itemized bills — add, edit, or remove custom line items before sending
- Send the finalized bill to the patient (edit locks after sending)
- Download bills as a professional branded **PDF**
- Manage hospital medicine inventory (add, edit, remove)
- Receive real-time notifications when patients complete payment

### 🔔 Real-time Notification System (Socket.io)
Each role receives targeted, event-driven notifications delivered instantly:

| Event | Patient | Doctor | Admin |
|---|:---:|:---:|:---:|
| Video call scheduled | ✅ | ✅ | |
| Bill generated | ✅ | | |
| Bill paid | | ✅ | ✅ |
| Appointment accepted/rejected | ✅ | | |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + HTTP-only Cookies |
| Real-time | Socket.io |
| Video Calls | Jitsi Meet (auto-generated room link, browser-based) |
| File Storage | Cloudinary |
| PDF Generation | jsPDF |
| Charts | Chart.js, React-Chartjs-2 |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A [Cloudinary](https://cloudinary.com/) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/aayRJ23/Hospital_Management_System_SWE_Project.git
cd Hospital_Management_System_SWE_Project
```

---

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory (see [Environment Variables](#-environment-variables) below), then:

```bash
npm run dev
```

Server will start at `http://localhost:8000`

---

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

Frontend will start at `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder with the following format:

```env
# Server
PORT=8000

# MongoDB
MONGO_URI=mongodb://0.0.0.0:27017
ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=7d
COOKIE_EXPIRES=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

> Built with ❤️ by Aayush Raj as a Software Engineering academic project.