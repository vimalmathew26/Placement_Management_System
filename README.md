
# 📚 Placement Management System (PMS)

A comprehensive web application to manage and streamline the entire campus placement process. This document provides all the necessary steps for setting up and running the PMS project.

---

## 🚀 Getting Started

### 🔧 Prerequisites

Ensure the following tools are installed:

- **Python 3.10+**
- **Node.js v18+** and **npm**
- **Git**
- **MongoDB** (local or cloud)
- *(Recommended)* Python virtual environment (`venv`)

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-org/your-repo.git
cd PMS
```

---

### 2️⃣ Backend Setup (`pms-core`)

#### a. Create and Activate Virtual Environment

```bash
cd pms-core

# Create venv
python -m venv pms_venv

# Activate venv
# Windows
pms_venv\Scripts\activate

# macOS/Linux
source pms_venv/bin/activate
```

#### b. Install Dependencies

```bash
pip install -r requirements.txt
# Optional extras
pip install -r optional-requirements.txt
```

---

### 3️⃣ Frontend Setup (`pms-ui`)

```bash
cd ../pms-ui
npm install
```

---

### 4️⃣ Database Setup (Admin User)

Create an admin user in your MongoDB `users` collection:

```json
{
  "user_name": "admin_user",
  "first_name": "John",
  "last_name": "Doe",
  "email": "admin@example.com",
  "password": "$2b$12$vEsKEn80hzxOHy9Ob528KOIi59ZMDntNIpNg3V8x3ERsBeoaypY9W",
  "role": "admin",
  "status": "Active"
}
```

**Login for Local Development:**

* Username: `admin@example.com`
* Password: `admin123`

#### ⚠️ Password Hash Troubleshooting

If the hash doesn’t work, generate a new one:

```python
from utilities import UtilMgr
u = UtilMgr()
print(u.hash_password("admin123"))
```

Replace the old hash in MongoDB with this output.

---

## ▶️ Running the Application

### 1️⃣ Start Backend

```bash
cd pms-core
uvicorn pms.main:app --reload
```

> `--reload` enables hot-reloading during development.

---

### 2️⃣ Start Frontend

#### 🔸 Production-like Mode (Recommended)

```bash
cd ../pms-ui
npm run build
npm run start
```

#### 🔹 Development Mode (Hot Reloading)

```bash
npm run dev
```

> ⚠️ Slower performance. Use only while actively developing.

---

## ⚙️ Environment Configuration

Environment variables are stored in `.env` files and are required for both backend and frontend.

---

### 🧩 Backend (`pms-core`)

Create the `.env` file:

```bash
cd pms-core
cp .env.example .env
```

Required variables:

| Variable                      | Example                                               | Description                |
| ----------------------------- | ----------------------------------------------------- | -------------------------- |
| `DATABASE_URI`                | mongodb+srv://user\:pass\@cluster.mongodb.net/        | MongoDB connection string  |
| `DATABASE_NAME`               | pms\_dev\_db                                          | MongoDB database name      |
| `SECRET_KEY`                  | a\_very\_long\_random\_string                         | Used for JWT signing       |
| `ALGORITHM`                   | HS256                                                 | JWT algorithm              |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 60                                                    | Session expiry duration    |
| `UPLOADS_PATH`                | uploads/                                              | Directory for file uploads |
| `MAIL_USERNAME`               | [your-email@gmail.com](mailto:your-email@gmail.com)   | SMTP email                 |
| `MAIL_PASSWORD`               | your\_app\_password                                   | App-specific password      |
| `MAIL_FROM`                   | [no-reply@your-app.com](mailto:no-reply@your-app.com) | Sender address             |
| `MAIL_PORT`                   | 587                                                   | SMTP port                  |
| `MAIL_SERVER`                 | smtp.gmail.com                                        | SMTP server                |

---

### 🌐 Frontend (`pms-ui`)

Create:

```bash
cd ../pms-ui
touch .env.development .env.production
```

Sample variables:

| Variable                   | Environment | Example                                              | Description          |
| -------------------------- | ----------- | ---------------------------------------------------- | -------------------- |
| `MONGODB_URI`              | both        | mongodb+srv://...                                    | Mongo URI            |
| `NEXT_PUBLIC_API_BASE_URL` | development | [http://127.0.0.1:8000](http://127.0.0.1:8000)       | Backend URL          |
| `NEXT_PUBLIC_API_BASE_URL` | production  | [https://api.your-app.com](https://api.your-app.com) | Deployed backend URL |

---

### ✅ Checklist

* [ ] Create `pms-core/.env`
* [ ] Create `pms-ui/.env.development`
* [ ] Create `pms-ui/.env.production`
* [ ] Fill all MongoDB URIs
* [ ] Generate a strong `SECRET_KEY`
* [ ] Fill in SMTP credentials

---

## 🏛️ Project Overview

A role-based campus placement platform with dashboards for students, faculty, and alumni.

---

### 🛠️ Backend (`pms-core`)

* **Framework:** FastAPI
* **DB:** MongoDB
* **Validation:** Pydantic
* **Auth:** JWT

**Architecture:**

* `routes/` - API endpoints
* `services/` - Business logic
* `db/repository/` - Database access
* `db/models/` - Data schemas

**Key Features:**

* Multi-role user management
* Placement drive lifecycle
* Student job application portal
* Resume/document upload
* Notices, forums, messaging
* Placement analytics

---

### 🎨 Frontend (`pms-ui`)

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI:** React + Tailwind CSS

**Architecture:**

* Role-based folders: `/students`, `/faculty`, `/alumni`
* `middleware.ts`: Role redirection
* Reusable components: `components/`
* API & state: `useApi`, `useUser`, `AuthContext`

**Highlights:**

#### Faculty/Admin Portal

* Manage users, drives, companies
* Post notices & analyze performance
* Moderate community hub

#### Student Portal

* Apply for jobs
* Upload resumes
* Profile & dashboard

#### Alumni Portal

* Update profiles
* View community posts

#### Shared Features

* Community hub (posts, comments, DMs)
* Secure login with password reset
* Centralized notice board

---

📌 **Note:** For best performance, always use:

```bash
npm run build && npm run start
```

---

