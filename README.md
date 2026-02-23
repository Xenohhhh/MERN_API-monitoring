# API Monitoring SaaS (MERN + Redis)

A scalable API uptime monitoring SaaS built with the MERN stack.
Users can register, create API monitors, and receive alerts when their endpoints go down.

This project demonstrates backend system design, background job processing, multi-tenant architecture, and secure authentication.

## 🚀 Features (v1)

* User authentication (JWT-based)
* Secure password hashing with bcrypt
* Protected API routes using auth middleware
* Multi-user (multi-tenant) architecture
* Monitor creation (URL + interval)
* Background job processing (Redis + worker)
* Email alerts on status change (UP ↔ DOWN)
* Uptime tracking and monitoring logs (10-day retention)
* Plan-based monitor limits (Free tier support)

## 🏗 Architecture Overview

The system is structured into three independent components:

### 1️⃣ Backend API (Express + MongoDB)

Handles:

* Authentication
* Monitor CRUD operations
* Dashboard APIs
* User plan enforcement

### 2️⃣ Worker Service (Node + Redis)

Handles:

* Recurring monitoring jobs
* HTTP request execution
* Logging monitor results
* Alert triggering
* Status change detection

### 3️⃣ Frontend (React)

Handles:

* User authentication UI
* Dashboard
* Monitor management
* Monitoring history display

## 🧠 System Design Highlights

* Individual recurring jobs per monitor (scalable scheduling)
* Queue-based background processing using Redis
* Status-change alert logic (prevents email spam)
* Separation of concerns (API vs Worker service)
* Designed for horizontal scalability
* Clean SaaS-oriented data modeling

## 🔐 Authentication

* Passwords hashed using bcrypt
* JWT-based authentication
* Protected routes via middleware
* Environment-based secret management

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* Redis (BullMQ)
* React
* JWT
* bcrypt

## 🔄 Alert Logic

* Email sent only when status changes
* UP → DOWN notification
* DOWN → UP recovery notification
* Prevents alert spamming

## 📈 Scalability Considerations

* Worker runs independently from API server
* Recurring job scheduling per monitor
* Easily horizontally scalable by adding more workers
* Log retention limited to 10 days
* Designed for multi-user SaaS growth

## 🧪 Future Improvements

* Paid subscription tiers
* SMS/Discord alerts
* Region-based monitoring
* Incident tracking dashboard
* Rate limiting per plan
* Advanced uptime analytics

## 🛠 Setup Instructions

1. Clone repository
2. Install dependencies in `backend`, `worker`, and `frontend`
3. Configure environment variables:
   * MongoDB URI
   * Redis connection
   * JWT secret
4. Start backend
5. Start worker
6. Start frontend
