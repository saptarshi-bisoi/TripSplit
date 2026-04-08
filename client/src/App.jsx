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