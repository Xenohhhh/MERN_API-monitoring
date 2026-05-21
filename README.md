# 🚀 MonitorX

MonitorX is a full-stack SaaS uptime monitoring platform that continuously checks websites and APIs, tracks uptime and response times, stores monitoring analytics, and sends email alerts when services go down.

Inspired by platforms like UptimeRobot and Better Stack.

---

# ✨ Features

## 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Auto-login after registration
* Logout functionality
* Conditional routing (landing page only for non-logged users)

---

## 📡 Monitoring System

* Add monitors with custom intervals
* Monitor APIs and websites
* Supported intervals:
  * 60 seconds
  * 300 seconds
  * 600 seconds
* URL validation
* User-specific monitors (multi-user support)

---

## ⚙️ Background Job Processing

* BullMQ queue system
* Redis-powered job scheduling
* Background workers continuously monitor endpoints
* Independent monitoring even if user closes browser

---

## 📊 Analytics Dashboard

* Total monitors
* Services UP/DOWN statistics
* Real-time monitor status cards
* Response time tracking
* Uptime percentage calculation
* Mini response-time graphs
* Detailed monitor analytics page
* Logs and monitoring history

---

## 🔔 Alert System

* Email alerts when services go DOWN
* Recovery alerts when services come back UP
* Alert spam prevention logic

---

## 💰 SaaS Plan System

* Free / Pro / Premium plans
* Plan-based monitor limits
* Pricing page
* Upgrade system (V1 without payment integration)

---

## 🎨 UI / UX

* Responsive dashboard
* SaaS-style landing page
* Framer Motion animations
* Tailwind CSS styling
* Smooth hover interactions
* Empty states and polished UI feedback

---

# 🏗️ Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Recharts
* Axios
* React Router

## Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

## Background Processing

* BullMQ
* Redis

## Notifications

* NodeMailer

---

# 🧠 Architecture

```text
User
 → Creates Monitor
 → Scheduler Adds Job
 → Worker Checks API
 → Logs Stored in MongoDB
 → Alerts Triggered if Needed
 → Frontend Displays Analytics
```

---

# 📂 Project Structure

```bash
frontend/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── services/
 │   └── utils/

backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── models/
 │   ├── middleware/
 │   ├── workers/
 │   └── utils/
```

---

# 🔐 Authentication Flow

```text
User Login/Register
 → JWT Token Generated
 → Token Stored in localStorage
 → Protected Routes Accessed
 → Backend Verifies Token
```

---

# ⚡ Monitoring Flow

```text
Monitor Created
 → BullMQ Schedules Job
 → Worker Executes Periodic HTTP Checks
 → Response Time + Status Stored
 → Dashboard Updates
 → Email Alert Triggered if DOWN
```

---

# 📈 Uptime Calculation

Uptime is calculated using:

```text
Successful Checks / Total Checks × 100
```

Example:

```text
18 successful checks out of 20
= 90% uptime
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd monitorx
```

---

## 2️⃣ Install Dependencies

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

## 3️⃣ Environment Variables

Create `.env` file inside backend:

```env
PORT=8000

MONGODB_URI=your_mongodb_uri

ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 4️⃣ Start Development Servers

### Frontend

```bash
npm run dev
```

### Backend

```bash
npm run dev
```

### Worker

```bash
npm run worker
```

### Scheduler

```bash
npm run scheduler
```

---

# 🌍 Future Improvements

* Stripe payment integration
* Public status pages
* Slack/Discord alerts
* Team collaboration
* Dark mode
* Region-based monitoring
* Advanced analytics

---
