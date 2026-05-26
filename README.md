# CodeNest — The Modern Coding Platform for Developers

---

## 📌 Overview

**CodeNest** is a full-stack coding platform that allows developers to practice programming, solve coding challenges, submit solutions, and track their progress through an interactive and responsive interface.

The platform combines a scalable backend built with **Node.js, Express.js, and MongoDB** with a modern frontend powered by **React.js** and **Tailwind CSS**.

---

# 🚀 Features

## 👤 User Management

- Secure Signup and Login using **JWT Authentication**
- Password encryption using **bcryptjs**
- Persistent user sessions
- User profile management

---

## 💻 Code Playground

- Real-time code editor using **Monaco Editor**
- Syntax highlighting support
- Multi-language support:
  - C++
  - Python
  - Java
  - JavaScript
- Code execution and output visualization

---

## 🧩 Problem Management

- Browse coding problems categorized by difficulty
- View detailed problem statements
- Access constraints and examples
- Submit solutions and receive test case results
- Track solved problems

---

## 📊 User Dashboard

- Personalized user dashboard
- Track solved problems and submission history
- View accuracy and performance statistics
- Monitor coding progress

---

## 🧠 Admin Features

- Add new coding problems
- Edit existing problems
- Delete coding challenges
- Manage users and monitor submissions

---

# ⚙️ Tech Stack

## 🧩 Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- React Redux
- Monaco Editor

---

## ⚡ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

# 📡 API Endpoints

## 🧑‍💻 Authentication Routes (`/user`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/user/register` | Public | Register a new user |
| POST | `/user/admin/register` | Admin Only | Register a new admin user |
| POST | `/user/login` | Public | Log in an existing user |
| POST | `/user/logout` | User Only | Log out the current user |
| GET | `/user/check` | User Only | Verify authentication and fetch user details |
| DELETE | `/user/deleteProfile` | User Only | Delete logged-in user account |

---

## 🧩 Problem Routes (`/problem`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/problem/create` | Admin Only | Create a new coding problem |
| PUT | `/problem/update/:id` | Admin Only | Update problem details |
| DELETE | `/problem/delete/:id` | Admin Only | Delete a coding problem |
| GET | `/problem/ProblemById/:id` | User Only | Fetch problem details |
| GET | `/problem/getAllProblem` | User Only | Fetch all coding problems |
| GET | `/problem/problemSolvedByUser` | User Only | Fetch solved problems |
| GET | `/problem/submittedProblem/:pid` | User Only | Fetch submission history |

---

## 🧠 Submission Routes (`/submit`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/submit/run/:id` | User Only | Run code against sample test cases |
| POST | `/submit/submit/:id` | User Only | Submit final solution and store result |

---

# ⚙️ Middleware

| Middleware | Description |
|------------|-------------|
| `userMiddleware` | Validates JWT token and authorizes logged-in users |
| `adminMiddleware` | Verifies admin privileges |

---

# 🔮 Future Enhancements

- 🏆 Leaderboard and ranking system
- 💬 Discussion section for coding problems
- 🤖 AI-based solution recommendations
- 👨‍💻 Real-time collaborative coding
- 🎖️ User badges and achievements
- 🌙 Dark/Light theme toggle

---

# 🛠️ Installation & Setup

## Clone the Repository

```bash
git clone [https://github.com/bhaveshTripathi3112/CodeNest.git]
cd codehub
```

## Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## Run the Project

### Start Backend Server

```bash
npm run server
```

### Start Frontend

```bash
npm start
```

---

# 👨‍💻 Contributors

- Frontend Development: **Yash Kirola**
- Backend Development: **Bhavesh Tripathi**

---
