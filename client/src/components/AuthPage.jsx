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
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userId', data.user.id); // Gap Fix #2: needed for "Shared" badge in Dashboard
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
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans antialiased text-gray-700">
      
      {/* Left Full Height Cover */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <img 
          src="/split.gif" 
          alt="Splitting costs" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Content Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link to="/" className="text-4xl font-extrabold tracking-tight">
              <span className="text-slate-900">Trip</span><span className="text-[#00786f]">Split</span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} 
                  className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#00786f] focus:ring-1 focus:ring-[#00786f] transition" 
                  placeholder="Full Name *" required={!isLogin} 
                />
              </div>
            )}
            <div>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} 
                className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#00786f] focus:ring-1 focus:ring-[#00786f] transition" 
                placeholder="Email" required 
              />
            </div>
            <div>
              <input 
                type="password" name="password" value={formData.password} onChange={handleChange} 
                className="w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#00786f] focus:ring-1 focus:ring-[#00786f] transition" 
                placeholder="Password *" required 
              />
            </div>
            <button type="submit" className="w-full bg-[#00786f] text-white font-medium py-3 rounded-md shadow hover:bg-[#005C55] transition mt-6">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm font-medium">
            {isLogin ? (
              <p className="text-slate-900">Don't have an account? <Link to="/signup" className="hover:text-[#00786f] hover:underline ml-1">Sign up</Link></p>
            ) : (
              <p className="text-slate-900">Already have an account? <Link to="/login" className="hover:text-[#00786f] hover:underline ml-1">Log in</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;