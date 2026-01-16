# EVMS 2.0 - Employee Verification & Management System

**EVMS 2.0** is a robust, Next.js-based application designed for efficient employee management, verification, and critical incident reporting. It features a dual-portal architecture (Public & Admin) to handle extensive employee data, QR-based verification, and real-time grievance tracking for smart city initiatives.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![Prisma](https://img.shields.io/badge/Prisma-6+-2d3748)
![License](https://img.shields.io/badge/license-Private-red)

## 🚀 Features

### 🏛️ Admin Portal
- **Role-Based Access Control (RBAC):** Secure access for Super Admins, Department Admins, and Officers.
- **Employee Management:** Comprehensive profiles including personal details, education, experience, and service history.
- **QR Code Generation:** Automatic QR code generation for instant employee verification.
- **Incident Management:** Dashboard for tracking, triaging, and resolving public reports.
- **Audit Logs:** Full traceability of administrative actions.

### 🌐 Public Portal
- **Report Tracking:** Citizens can track the status of their reported grievances.
- **Employee Verification:** Public scanning of employee QR codes to verify identity.
- **News & Downloads:** Public-facing resources and department updates.

### ⚙️ Core Functionality
- **Smart Auto-Triage:** AI-assisted categorization and prioritization of reports (CRITICAL, HIGH, etc.).
- **Live Maps:** Interactive maps for visualizing report hotspots.
- **Cron Jobs:** Automated escalation for unresolved high-priority issues.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Database:** PostgreSQL (via [Supabase](https://supabase.com/) / Neon)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Tailwind CSS + UI Components (Glassmorphism design)
- **Maps:** Leaflet / React-Leaflet
- **Authentication:** Custom JWT / Session-based (Bcrypt)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database URL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nisheekachavhan17/EVMS.git
   cd EVMS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
   DIRECT_URL="postgresql://user:password@host:port/db"

   # Security
   JWT_SECRET="your-super-strong-secret"
   
   # App Config
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   # OR for local network access
   npm run dev:https
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment on Vercel

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the **Environment Variables** (DATABASE_URL, JWT_SECRET, etc.) in the Vercel project settings.
4. Click **Deploy**.

## 📂 Project Structure

```
├── src/
│   ├── app/                # Next.js App Router pages & layouts
│   │   ├── admin/          # Admin Portal routes
│   │   ├── public/         # Public Portal routes
│   │   └── api/            # Backend API routes
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions & Server Actions
│   └── styles/             # Global styles
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
└── ...config files
```

## 🔒 Security
- **Strict Content Security Policy (CSP)**
- **HttpOnly Cookies** for sessions
- **Input Validation** using Zod

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
