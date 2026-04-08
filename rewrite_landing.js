const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden relative">
      
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
      }}></div>

      <nav className="w-full bg-[#FAFAFA]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="text-2xl font-extrabold tracking-tight z-50">
          <i className="fa-solid fa-scale-balanced text-[#00786f] mr-2"></i>
          <span className="text-slate-900">Trip</span><span className="text-[#00786f]">Split</span>
        </Link>
        <div className="space-x-4 flex items-center z-50">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-slate-900 font-semibold hover:text-[#00786f] transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-slate-500 font-semibold py-2 px-4 hover:text-rose-600 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 font-semibold hover:text-[#00786f] transition hidden sm:inline-block">Log in</Link>
              <Link to="/signup" className="bg-[#00786f] text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-[#005c55] hover:-translate-y-0.5 transition transform text-sm">Start Now</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative w-full max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
          
          {/* Floating Avatars (Absolute Positioning) */}
          <div className="hidden lg:block absolute top-12 left-10 transform -rotate-12 animate-pulse" style={{ animationDuration: '4s' }}>
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Annie" alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-purple-100" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-location-arrow -rotate-45 text-xs"></i></div>
          </div>
          
          <div className="hidden lg:block absolute top-4 right-16 transform rotate-12 animate-pulse" style={{ animationDuration: '5s' }}>
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jack" alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-orange-100" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-location-arrow rotate-180 text-xs text-[#00786f]"></i></div>
          </div>

          <div className="hidden lg:block absolute bottom-10 left-20 transform -rotate-6 animate-pulse" style={{ animationDuration: '4.5s' }}>
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Maria" alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-blue-100" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-location-arrow rotate-45 text-xs text-[#00786f]"></i></div>
          </div>

          <div className="hidden lg:block absolute bottom-24 right-10 transform rotate-6 animate-pulse" style={{ animationDuration: '3.5s' }}>
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=George" alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-yellow-100" />
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-location-arrow -rotate-135 text-xs"></i></div>
          </div>

          {/* Hero Content */}
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-8">
            <i className="fa-solid fa-bolt text-[#00786f]"></i>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600">Created For Fast Settlements</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-slate-900 mb-8 leading-[1.1] max-w-4xl tracking-tight">
            One tool to <span className="relative inline-block border-b-8 border-[#00786f] pb-1">manage</span> <br />expenses and your group
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 leading-relaxed">
            TripSplit helps friend groups work faster, smarter, and more efficiently, delivering exact settlement calculations to mitigate arguments and ensure financial clarity.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="bg-[#00786f] text-white text-lg font-bold py-4 px-10 rounded-xl shadow-[0_8px_30px_rgba(0,120,111,0.3)] hover:bg-[#005c55] hover:-translate-y-1 transition transform duration-300">
              {isLoggedIn ? "Access Workspace" : "Start for Free"}
            </Link>
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="bg-white text-slate-700 text-lg font-bold py-4 px-10 rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:-translate-y-1 transition transform duration-300">
              Get a Demo
            </Link>
          </div>
        </section>

        {/* PARTNER LOGOS */}
        <section className="w-full border-y border-gray-200 bg-white/50 backdrop-blur-sm py-10 mt-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between opacity-50 grayscale hover:grayscale-0 transition duration-500">
            <div className="text-sm font-bold text-slate-800 uppercase tracking-widest max-w-[200px] mb-6 md:mb-0">
              More than 100+ groups trust us
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-3xl text-slate-900">
              <span className="flex items-center space-x-2 font-bold"><i className="fa-brands fa-hubspot text-[#ff7a59]"></i> <span>HubSpot</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-brands fa-dropbox text-[#0061ff]"></i> <span>Dropbox</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-brands fa-square-font-awesome text-gray-800"></i> <span>Square</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-brands fa-intercom text-[#286efa]"></i> <span className="uppercase tracking-tighter">Intercom</span></span>
            </div>
          </div>
        </section>

        {/* COMPLEX FEATURES GRID */}
        <section className="w-full max-w-6xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-50 text-[#00786f] rounded border border-teal-100 mb-6 uppercase text-xs font-bold tracking-widest">
              <i className="fa-solid fa-border-all"></i> <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight max-w-3xl mx-auto">
              Latest advanced technologies to ensure everything you need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Maximize your group's harmony and financial security with our highly-affordable, user-friendly expense management system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Dynamic Dashboard (Takes 2 Columns on Large Screens) */}
            <div className="lg:col-span-2 bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row justify-between relative overflow-hidden transition hover:shadow-xl hover:border-teal-200">
              <div className="max-w-xs z-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Dynamic dashboard</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  TripSplit helps friend groups work faster, smarter, and with complete visibility, mitigating risk and ensuring total compliance on group vacations.
                </p>
                <button className="bg-[#00786f] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#005c55] transition">Explore all</button>
              </div>
              
              {/* Fake UI: Bar Chart Map */}
              <div className="mt-10 md:mt-0 flex-1 md:ml-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 z-10 h-72 hidden sm:flex flex-col opacity-90 transform translate-x-4 md:translate-x-12 translate-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <span className="font-bold text-slate-700 flex items-center space-x-2"><span>Lake Tahoe</span> <i className="fa-solid fa-chevron-down text-xs"></i></span>
                  <div className="flex -space-x-2">
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=A" className="w-8 h-8 rounded-full border-2 border-white bg-red-100" alt="1" />
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=B" className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" alt="2" />
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=C" className="w-8 h-8 rounded-full border-2 border-white bg-green-100" alt="3" />
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-between space-x-2 pt-4">
                  {/* Fake bars */}
                  {[3, 6, 4, 10, 5, 8, 3, 4, 7, 2].map((height, i) => (
                      <div key={i} className={\`w-full rounded-t-sm \${height === 10 ? 'bg-[#00786f]' : 'bg-gray-200'}\`} style={{height: \`\${height * 10}%\`}}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Notifications */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 flex flex-col relative overflow-hidden transition hover:shadow-xl hover:border-teal-200">
               <h3 className="text-2xl font-bold text-slate-900 mb-4 mix-blend-multiply">Smart notifications</h3>
               <p className="text-slate-500 mb-8 leading-relaxed mix-blend-multiply">
                 Easily accessible alerts from the notification center, calendar, or email with relevant pending debts.
               </p>
               {/* Fake UI: Toggles */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col divide-y divide-gray-100">
                  <div className="p-4 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-800">Email notification</span>
                    <span className="text-xs font-bold text-[#00786f] cursor-pointer">Save</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-600">New expenses added</span>
                    <div className="w-10 h-5 bg-[#00786f] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div></div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-600">Settlement reminders</span>
                    <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div></div>
                  </div>
                   <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-600 opacity-50">Announcement and Update</span>
                    <div className="w-10 h-5 bg-[#00786f] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div></div>
                  </div>
               </div>
            </div>

             {/* Feature 3: Task Management / Activities */}
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Block for Task Management */}
                <div className="lg:col-span-1 border border-gray-200 bg-white rounded-3xl p-8 flex flex-col justify-center text-center">
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">Real-time Activity</h3>
                   <p className="text-slate-500 leading-relaxed">
                     Discuss specific expenses, manage receipts, secure approvals, and track total net group balance directly inside the unified workspace.
                   </p>
                </div>

                {/* Fake UI: Activity Stream */}
                <div className="lg:col-span-2 bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 md:p-12 flex relative overflow-hidden transition hover:shadow-xl hover:border-teal-200">
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.05)] transform sm:-rotate-2 transition hover:rotate-0 flex-col flex gap-4 z-10">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <span className="font-bold text-slate-900">Recent Activity</span>
                        <span className="text-[#00786f] font-bold text-sm cursor-pointer">+ Log new</span>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        {/* Item 1 */}
                        <div className="flex items-start gap-4">
                           <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Bill" className="w-10 h-10 rounded-full bg-blue-50" alt="Bill"/>
                           <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                               <span className="font-bold text-sm text-slate-800">Bill Sanders</span>
                               <span className="text-xs text-gray-400">10h</span>
                             </div>
                             <p className="text-xs text-slate-500 bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">Just added ₹1200 for the Hotel deposit! 🏨</p>
                           </div>
                        </div>
                         {/* Item 2 */}
                        <div className="flex items-start gap-4">
                           <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jane" className="w-10 h-10 rounded-full bg-orange-50" alt="Jane"/>
                           <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                               <span className="font-bold text-sm text-slate-800">Jane Cooper</span>
                               <span className="text-xs text-gray-400">1d</span>
                             </div>
                             <p className="text-xs text-slate-500 bg-gray-50 p-2 rounded-lg flex items-center gap-2 border border-gray-100"><i className="fa-solid fa-file-pdf text-rose-500"></i> Uploaded flight_receipts.pdf</p>
                           </div>
                        </div>
                      </div>
                   </div>
                   
                   {/* Background Decorative Circle */}
                   <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-300 opacity-20 rounded-full blur-3xl z-0"></div>
                </div>

            </div>

          </div>
        </section>

        {/* TESTIMONIAL & STATS */}
        <section className="w-full bg-[#00786f] text-white py-32 px-6 rounded-t-[3rem] mt-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Pattern inside Testimonial */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            
            <i className="fa-solid fa-quote-left text-5xl text-teal-300 mb-8 opacity-80"></i>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-12 max-w-4xl tracking-tight text-white hover:text-teal-50 transition">
              "TripSplit is helping our group radically decrease arguments and turnaround time, while actively increasing the transparency, resource allocation, and effectiveness of our shared expenses."
            </h2>
            
            <div className="flex flex-col items-center mb-24">
               <div className="flex -space-x-3 mb-4">
                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Darlene" className="w-12 h-12 rounded-full border-2 border-[#00786f] bg-yellow-400 relative z-10" alt="Darlene"/>
                 <div className="w-12 h-12 rounded-full border-2 border-[#00786f] bg-[#ccfbf1] flex items-center justify-center text-[#00786f] font-bold text-xl relative z-0"><i className="fa-solid fa-check"></i></div>
               </div>
               <span className="font-bold text-lg">Darlene Robertson</span>
               <span className="text-teal-200 font-semibold text-sm uppercase tracking-widest mt-1">Head Organizer at Roomies</span>
            </div>

            {/* Huge Stats Row */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
               <div className="flex flex-col items-center justify-center transition hover:-translate-y-1">
                  <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">2024</span>
                  <span className="text-lg text-teal-100 font-semibold">TripSplit Founded</span>
               </div>
               <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-10 md:pt-0 transition hover:-translate-y-1">
                  <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">50K+</span>
                  <span className="text-lg text-teal-100 font-semibold">Active Users</span>
               </div>
               <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-10 md:pt-0 transition hover:-translate-y-1">
                  <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">1M+</span>
                  <span className="text-lg text-teal-100 font-semibold">Expenses Logged</span>
               </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
`;

fs.writeFileSync('client/src/components/LandingPage.jsx', code);
console.log('Landing page successfully overwritten with purely Teal SaaS structure!');
