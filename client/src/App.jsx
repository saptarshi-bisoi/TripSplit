import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import ProtectedRoute from './components/ProtectedRoute'; // Gap Fix #1

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/signup" element={<AuthPage isLogin={false} />} />
        {/* Gap Fix #1: wrap authenticated routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips/:tripId" element={<ProtectedRoute><TripView /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;