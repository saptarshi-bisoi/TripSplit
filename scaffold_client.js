const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content.trim());
}

// Ensure inside client
const srcDir = 'client/src';

// tailwind.config.js
const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: { 700: '#1E8282' },
        slate: { 900: '#111827' },
        gray: { 600: '#4B5563' }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
`;
writeFile('client/tailwind.config.js', tailwindConfig);

const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
writeFile('client/postcss.config.js', postcssConfig);

// src/index.css
const indexCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
`;
writeFile(path.join(srcDir, 'index.css'), indexCss);

// App.jsx
const appJsx = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/signup" element={<AuthPage isLogin={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips/:tripId" element={<TripView />} />
      </Routes>
    </Router>
  );
}

export default App;
`;
writeFile(path.join(srcDir, 'App.jsx'), appJsx);

const mainJsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
writeFile(path.join(srcDir, 'main.jsx'), mainJsx);

// LandingPage.jsx
const landingJsx = `
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-600 antialiased">
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-teal-700">Trip</span><span className="text-slate-900">Split</span>
        </div>
        <div className="space-x-4 flex items-center">
          <Link to="/login" className="text-slate-900 font-semibold hover:text-teal-700 transition">Log in</Link>
          <Link to="/signup" className="bg-teal-700 text-white font-bold py-2 px-5 rounded-lg shadow hover:bg-[#156868] transition">Sign up</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight max-w-4xl">
          Split Expenses With Friends, <span className="text-teal-700">Stress-Free.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          TripSplit is the easiest way to track shared expenses, calculate exact settlements, and make sure everyone gets paid back. Perfect for group trips, roommates, and nights out.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup" className="bg-teal-700 text-white text-lg font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#156868] hover:-translate-y-0.5 transition transform">
            Get Started for Free
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center text-2xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Track Trips</h3>
            <p className="text-center">Create dedicated boards for every trip and invite your friends.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center text-2xl mb-4">🧾</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Log Expenses</h3>
            <p className="text-center">Add expenses easily and specify exact or equal splits.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center text-2xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Settle Up</h3>
            <p className="text-center">We calculate the math so you know exactly who owes whom.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
`;
writeFile(path.join(srcDir, 'components', 'LandingPage.jsx'), landingJsx);

// AuthPage.jsx
const authJsx = `
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = ({ isLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(\`http://localhost:5000\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans antialiased text-gray-600">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight">
            <span className="text-teal-700">Trip</span><span className="text-slate-900">Split</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 mt-6">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-700 transition" 
                placeholder="John Doe" required={!isLogin} 
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Email Address</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} 
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-700 transition" 
              placeholder="you@example.com" required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Password</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} 
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-700 transition" 
              placeholder="••••••••" required 
            />
          </div>
          <button type="submit" className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#156868] transition transform active:scale-95 mt-4">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm">
          {isLogin ? (
            <p>Don't have an account? <Link to="/signup" className="text-teal-700 font-bold hover:underline">Sign up</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login" className="text-teal-700 font-bold hover:underline">Log in</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
`;
writeFile(path.join(srcDir, 'components', 'AuthPage.jsx'), authJsx);

// Dashboard.jsx
const dashboardJsx = `
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        if (response.ok) {
          setTrips(await response.json());
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) { } finally { setLoading(false); }
    };
    fetchTrips();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-600 antialiased">
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-teal-700">Trip</span><span className="text-slate-900">Split</span>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="text-gray-500 font-semibold hover:text-red-500 transition">Logout</button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Your Dashboard</h1>
            <p className="text-gray-500">Manage your group trips and expenses.</p>
          </div>
          <button className="bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#156868] transition transform active:scale-95 flex items-center">
             + New Trip
          </button>
        </div>

        {loading ? <div className="text-center py-20 text-teal-700 font-bold">Loading...</div> : 
         trips.length === 0 ? (
           <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No trips yet</h2>
              <p className="text-gray-500">Create your first group trip to start tracking expenses.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {trips.map(trip => (
               <div key={trip._id} onClick={() => navigate(\`/trips/\${trip._id}\`)} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                 <h3 className="text-xl font-bold text-slate-900 mb-4">{trip.name}</h3>
                 <p className="text-sm text-gray-500 mb-4">{trip.expenses.length} logged expenses</p>
               </div>
             ))}
           </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;
`;
writeFile(path.join(srcDir, 'pages', 'Dashboard.jsx'), dashboardJsx);

// TripView.jsx
const tripViewJsx = `
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TripView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  const fetchTripData = async () => {
    try {
      const response = await fetch(\`http://localhost:5000/api/trips/\${tripId}\`, {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrip(data.trip);
        setSettlements(data.settlements);
      } else {
        navigate('/dashboard');
      }
    } catch (err) { console.error(err); } 
      finally { setLoading(false); }
  };

  useEffect(() => { fetchTripData(); }, [tripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !payer) return;

    const splitAmount = parseFloat(amount) / trip.members.length;
    const sharesObj = {};
    trip.members.forEach(m => sharesObj[m._id] = splitAmount);

    try {
      const response = await fetch(\`http://localhost:5000/api/trips/\${tripId}/expenses\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        },
        body: JSON.stringify({ description, amount: parseFloat(amount), payer, shares: sharesObj })
      });
      
      if (response.ok) {
        setDescription(''); setAmount(''); setPayer('');
        fetchTripData(); 
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-teal-700">Loading Table...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600 font-sans py-10">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-teal-700 font-bold mb-4 hover:underline">
          &lt;- Back to Dashboard
        </button>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{trip.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              Add Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Total Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Who Paid?</label>
                <select value={payer} onChange={(e) => setPayer(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none bg-white" required>
                  <option value="" disabled>Select member...</option>
                  {trip.members.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#156868] transition">Log Expense</button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                Who Owes Whom?
              </h2>
              <div className="space-y-3">
                {settlements.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-teal-700 bg-teal-50 rounded border border-teal-100">
                    <p className="font-bold">All settled up!</p>
                  </div>
                ) : (
                  settlements.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="font-bold text-slate-900">{s.from}</div>
                      <div className="mx-2 text-teal-400 text-xs text-center">-&gt;</div>
                      <div className="text-right">
                        <div className="font-bold text-teal-700">₹{s.amount}</div>
                        <div className="text-xs text-slate-500 font-bold">to {s.to}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                Recent Expenses
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {trip.expenses.length === 0 ? (
                  <p className="text-center text-gray-400 italic py-4">No history yet.</p>
                ) : (
                  [...trip.expenses].reverse().map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-lg">
                       <div>
                         <h4 className="font-bold text-slate-900">{e.description}</h4>
                         <p className="text-xs text-gray-500">{e.payer?.name} paid</p>
                       </div>
                       <span className="font-bold text-teal-700">₹{e.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TripView;
`;
writeFile(path.join(srcDir, 'pages', 'TripView.jsx'), tripViewJsx);

console.log("Client configured successfully by Node script!");
