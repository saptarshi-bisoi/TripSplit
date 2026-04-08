import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-600 antialiased">
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#00786f]">Trip</span><span className="text-slate-900">Split</span>
        </Link>
        <div className="space-x-4 flex items-center">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-slate-900 font-semibold hover:text-teal-700 transition">Dashboard</Link>
              <button onClick={handleLogout} className="bg-rose-600 text-white font-bold py-2 px-5 rounded-lg shadow hover:bg-rose-700 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-900 font-semibold hover:text-teal-700 transition">Log in</Link>
              <Link to="/signup" className="bg-teal-700 text-white font-bold py-2 px-5 rounded-lg shadow hover:bg-[#156868] transition">Sign up</Link>
            </>
          )}
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
          <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="bg-teal-700 text-white text-lg font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#156868] hover:-translate-y-0.5 transition transform">
            {isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
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