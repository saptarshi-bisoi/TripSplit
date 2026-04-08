# TripSplit ✈️

> **Everything you need to stop arguing over money.**

TripSplit is a fully-featured, full-stack MERN web application engineered for friend groups, roommates, and frequent travelers. It replaces complex, error-prone spreadsheets by providing a unified workspace to track shared expenses, digitize receipts, and calculate exact debt settlements dynamically.

## 🚀 Key Features

*   **Secure Unified Workspaces:** Create dedicated groups for specific events (e.g., "Lake Tahoe 2026", "Apartment Utilities") and invite trusted members.
*   **Dynamic Expense Engine:** Log real-time expenses with detailed notes. Support for equal distribution splits amongst group members.
*   **Visual Trip Breakdowns:** Intuitive, Tailwind-powered dashboards calculate and visualize net positive and net negative balances automatically, ensuring total financial transparency.
*   **JWT Authentication:** Robust backend security ensuring private group data remains secure.
*   **Responsive Architecture:** Fully mobile-optimized UI tailored for logging expenses on the go.

## 🛠️ The Technology Stack

Designed for high-performance and rapid scaling.

*   **Frontend Ecosystem:** React 18, Vite build tooling, React Router DOM v6
*   **Styling Architecture:** Tailwind CSS v4 featuring bespoke geometric UI patterns and custom brand tokening (TripSplit Teal).
*   **Backend Server:** Express.js, Node.js, strict CORS configuration.
*   **Database:** MongoDB via Mongoose schema validation.

## 💻 Local Development Setup

To run TripSplit locally on your machine, you need to spin up the independent backend and frontend environments.

### 1. The Express Backend (API)
Navigate to the server directory, install dependencies, and start the node server.
```bash
cd server
npm install
npm start
```

### 2. The React Frontend (Client)
Open a new terminal window, navigate to the client directory, install UI dependencies, and boot Vite.
```bash
cd client
npm install
npm run dev
```
The application will launch automatically at \`http://localhost:5173/\`.

---

*Designed and engineered in 2026 to simplify shared experiences.*
