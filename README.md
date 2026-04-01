# NoteKeeper — Notes Management Application

A simple, secure web-based system for creating, managing, and organizing personal notes online. Features user authentication, persistent storage with MySQL, and a modern frontend.

---

## Features
- **User Authentication**: Sign up and log in securely (JWT, bcrypt)
- **Personal Notes**: Add, view, edit, and delete your own notes
- **Responsive UI**: Clean, modern HTML/CSS/JS frontend
- **Persistent Storage**: MySQL database with users and notes tables
- **API Backend**: Node.js + Express REST API

---

## Project Structure
```
NoteManagementApp/
├── backend/         # Node.js/Express API
│   ├── config/      # DB config
│   ├── controllers/ # Auth & notes logic
│   ├── middleware/  # JWT auth
│   ├── routes/      # API routes
│   ├── .env         # Environment variables
│   ├── package.json
│   └── server.js
├── database/
│   └── schema.sql   # MySQL DB schema
└── frontend/        # HTML/CSS/JS UI
    ├── css/
    ├── js/
    ├── index.html   # Login/Sign-up
    └── notes.html   # Notes dashboard
```

---

## Setup Instructions

### 1. Database Setup
- Open `database/schema.sql` in MySQL Workbench
- Run the script to create the database and tables

### 2. Backend Setup
- Go to `backend/`
- Copy `.env.example` to `.env` and fill in your MySQL credentials
- Install dependencies:
  ```bash
  npm install
  ```
- Start the server:
  ```bash
  npm run dev
  ```
- You should see: `Connected to MySQL database. Server listening on http://localhost:5000`

### 3. Frontend Setup
- Open `frontend/index.html` in your browser
- For best results, use VS Code Live Server extension

---

## Usage
- **Sign up** for a new account
- **Log in** to access your notes
- **Create, edit, delete** notes — all changes are saved in MySQL

---

## Troubleshooting
- If you see `Unable to reach the server`, make sure the backend is running and `.env` is correct
- If MySQL connection fails, check your password and that MySQL is running
- For CORS or browser issues, use Live Server to open the frontend

---

## License
MIT
