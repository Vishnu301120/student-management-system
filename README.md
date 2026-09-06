# Student Management System (MERN Stack)

A simple, clean, and modern **Student Management System** built with MongoDB, Express.js, React, and Node.js.

## Features
- **User Authentication**: Secure Sign Up and Login with JWT and password hashing (bcryptjs).
- **Dashboard Overview**: Quick statistics on total students and active courses.
- **CRUD Operations**:
  - **Create**: Add new student with Name, Roll No, Email, Course, and Phone number.
  - **Read**: View list of enrolled students with real-time search filtering.
  - **Update**: Edit student details in a clean modal.
  - **Delete**: Remove student with one-click confirmation.
- **Protected Routes**: Dashboard is only accessible after logging in.

---

## Project Structure

```text
student management system/
├── backend/
│   ├── models/
│   │   ├── User.js            # User model (name, email, password)
│   │   └── Student.js         # Student model (name, rollNumber, email, course, phone)
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Me endpoints
│   │   └── student.js         # Student CRUD endpoints
│   ├── .env                   # Configuration (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js              # Express server setup & MongoDB connection
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx      # Login page
    │   │   ├── Register.jsx   # Registration page
    │   │   └── Dashboard.jsx  # Student CRUD dashboard & statistics
    │   ├── services/
    │   │   └── api.js         # Axios client with automatic JWT token attachment
    │   ├── App.jsx            # Routing & protected routes
    │   ├── index.css          # Clean & modern styling
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## How to Run Locally

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 2. Start the Backend
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
npm run dev
```
The server will start on **http://localhost:5000**.

> *Note*: If you use MongoDB Atlas, open `backend/.env` and update `MONGO_URI` with your connection string.

### 3. Start the Frontend
Open another terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser to use the application!
