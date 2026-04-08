# TripSplit 💸

TripSplit is a modern, full-stack web application designed to help friends and groups effortlessly log shared expenses and instantly calculate precise settlements (exactly who owes whom). 

Built with an unrelenting focus on clean UI/UX and zero-latency mathematics, it acts as a unified command center for all your group trips and financial tracking.

---

## 📸 Interface Screenshots

*(Note: Replace these placeholders with your actual screenshots saved inside a `docs/screenshots` folder)*

| **Secure Portals** | **Unified Dashboard** | **Split Calculator Sandbox** |
|:---:|:---:|:---:|
| <img src="docs/screenshots/login.png" alt="Login Portal" width="300" /> | <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="300" /> | <img src="docs/screenshots/main_area.png" alt="Main Area" width="300" /> |

---

## 🌟 Key Features

* **Advanced Debt Simplification Algorithm**: Built-in greedy algorithm shifted entirely to the frontend browser, allowing for instant, latency-free settlement proofs without needing backend database calls.
* **Unified Command Dashboard**: View all your groups at a glance using a beautifully responsive CSS Masonry Grid layout. No need to constantly jump between pages to see basic activity.
* **Flexible Split Engine**: Supports logging standard equal splits (e.g., 4 ways) as well as complex unequal divisions (e.g., friend A owes $10, friend B owes $20).
* **Robust Authentication**: Secured entirely via persistent JWTs encoded locally. Features a stunning, custom-built split-screen login portal.
* **Dynamic Avatars**: Seamless user profiles supporting custom uploaded images alongside procedural SVG avatar fallbacks (via DiceBear API).
* **Sleek Aesthetic**: Fully wrapped in a bespoke Teal (`#00786f`) and Slate brand identity, layered heavily with Tailwind V4 styling and FontAwesome iconography.

---

## 🛠️ Technology Stack

**Frontend Framework**
* React 18
* Vite
* Tailwind CSS v4
* React Router DOM v6

**Backend & Architecture**
* Node.js & Express.js API Router
* MongoDB & Mongoose Schema (Memory-native via `mongodb-memory-server` for instant local setups without installing standard Mongo daemons)
* JWT (JSON Web Tokens)
* bcryptjs for cryptographic salting

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed on your machine.

### Installation

1. **Clone the repository** leading directly to the `Tripsplit` root folder:
   ```bash
   cd Tripsplit
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application Locally

You will need two terminals running simultaneously to host the separate MERN environments.

**Terminal 1 (Backend Server)**
Ensure you are in the `server` directory, then start the Express API:
```bash
cd server
npm start
```
*The server will boot on `http://localhost:5000` and automatically bind to the in-memory MongoDB environment.*

**Terminal 2 (Frontend Client)**
Ensure you are in the `client` directory, then launch the Vite developer server:
```bash
cd client
npm run dev
```
*Vite will boot and hot-reload. Navigate your browser to `http://localhost:5173` to see the application!*

---

## 🛡️ Structure Highlights

* `/server/controllers/tripController.js`: Manages API logic, trip persistence, and schema bridging.
* `/client/src/utils/calculations.js`: Holds the localized debt simplification code executing fast heuristic tree settlements.
* `/client/src/pages/Dashboard.jsx`: The primary responsive masonry command center bridging your backend to your visual styling.
* `/client/src/pages/TripView.jsx`: The detailed calculator screen utilizing dynamic state arrays.
