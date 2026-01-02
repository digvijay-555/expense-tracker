# 💸 Expense Tracker – Fullstack Next.js App

A **production‑ready fullstack expense tracking application** built with **Next.js App Router**, **MongoDB**, **NextAuth**, **JWT‑secured APIs**, and **WhatsApp automation using Twilio**.

This project allows users to:

* Track daily expenses via a web dashboard
* Authenticate using **Email/Password** or **Google OAuth**
* Add expenses directly from **WhatsApp messages**
* View analytics and charts
* Download professional **PDF expense reports**
* Toggle dark/light mode

> 🚀 Built as a real‑world, scalable system — not a demo app.

---

## 🧩 Tech Stack

### Frontend

* **Next.js 16 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* Server & Client Components

### Backend

* **Next.js API Routes (App Router)**
* **MongoDB + Mongoose**
* **JWT (custom app token)**
* **NextAuth.js** (Google + Credentials provider)

### Integrations

* **Twilio WhatsApp Sandbox** – expense ingestion via chat
* **pdf-lib** – in‑memory PDF generation

### Deployment

* **Vercel** (serverless)
* **MongoDB Atlas**

---

## ✨ Features

### 🔐 Authentication

* Email & Password login (Credentials Provider)
* Google OAuth login
* Secure session handling with NextAuth
* Custom app‑level JWT for protected APIs

📸 *Screenshot: Login & Register pages*

---

### 📊 Expense Management

* Add, edit, delete expenses
* Categorized expenses
* Notes and dates supported
* Protected CRUD APIs

📸 *Screenshot: Expense List*

---

### 📈 Analytics Dashboard

* Monthly expense analytics
* Total spend calculation
* Category‑wise breakdown
* Chart visualization

📸 *Screenshot: Dashboard Analytics & Charts*

---

### 🌙 UI / UX

* Responsive layout
* Dark / Light mode toggle
* Clean dashboard UI
* Navbar with logout

📸 *Screenshot: Dark Mode Dashboard*

---

### 📲 WhatsApp Integration (Twilio)

Users can add expenses **directly from WhatsApp** using a simple text format.

#### Supported Commands

```text
expense 250 food lunch
```

Automatically:

* Authenticates user by WhatsApp number
* Parses message
* Stores expense in database
* Sends confirmation reply

📸 *Screenshot: WhatsApp expense message & reply*

---

### 📋 WhatsApp Expense Listing

Users can request their recent expenses via WhatsApp:

```text
list
```

The bot replies with a formatted list of recent expenses.

---

### 📄 PDF Expense Report

From the dashboard, users can:

* Generate a **professional PDF report**
* Download it directly in the browser

PDF includes:

* Tabular layout
* Date, category, note, amount
* Total expense calculation

📸 *Screenshot: Downloaded PDF Preview*

---

## 🏗️ Architecture Overview

```text
Client (Next.js)
   │
   ├── NextAuth (Google / Credentials)
   │       │
   │       └── Session + App JWT
   │
   ├── Protected API Routes
   │       │
   │       └── MongoDB (Expenses)
   │
   └── WhatsApp (Twilio Webhook)
           │
           └── Expense Ingestion
```

---

## 🔑 Environment Variables

Create a `.env.local` file with the following:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build (recommended before deploy)
npm run build
```

App runs at:

```
http://localhost:3000
```

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project into **Vercel**
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URL:

```text
https://your-app.vercel.app/api/auth/callback/google
```

5. Update Twilio WhatsApp webhook:

```text
POST https://your-app.vercel.app/api/whatsapp/webhook
```

---

## 🔐 Security Highlights

* No secrets exposed to frontend
* JWT‑protected APIs
* Server‑side Twilio integration
* WhatsApp number mapped securely to user
* No filesystem persistence required (serverless‑safe)

---

## 📌 Future Enhancements

* Monthly scheduled WhatsApp summaries
* Category‑wise PDF reports
* Expense export (CSV)
* OTP‑based WhatsApp linking
* Admin analytics

---

## 👨‍💻 Author

**Digvijay (Deceptor)**

Built as a real‑world fullstack project showcasing:

* Modern Next.js App Router patterns
* Authentication best practices
* Third‑party integrations (WhatsApp)
* Production deployment on Vercel

---

## ⭐ Final Note

If you’re reviewing this project:

> This is **not a tutorial clone** — it’s a thoughtfully designed, production‑ready system.

Feel free to ⭐ the repo and explore the codebase.
