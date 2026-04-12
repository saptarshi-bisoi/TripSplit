import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateSettlements } from '../utils/calculations';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState({}); // { tripId: 'expenses' or 'settlements' }
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const userId = localStorage.getItem('userId'); // Gap Fix #2: used to identify owned vs shared trips

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchTrips = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setTrips(await response.json());
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {} finally { setLoading(false); }
    };
    fetchTrips();
  }, [navigate]);

  const submitCreateTrip = async () => {
    const name = newTripName.trim();
    if (!name) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, members: [] }) 
      });
      if (response.ok) {
        const newTrip = await response.json();
        setIsModalOpen(false);
        setNewTripName('');
        navigate(`/trips/${newTrip._id}`);
      }
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId'); // Gap Fix #2: clear userId on logout
    navigate('/login');
  };

  const toggleTab = (tripId) => {
    setActiveTab(prev => ({
       ...prev, 
       [tripId]: prev[tripId] === 'settlements' ? 'expenses' : 'settlements' 
    }));
  };

  const filteredTrips = trips.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 flex flex-col justify-between py-8 px-6 bg-white border-r border-[#e2e8f0]">
        <div>
          {/* Logo */}
          <div className="flex items-center text-xl font-extrabold text-slate-900 mb-10 cursor-pointer" onClick={() => navigate('/')}>
             <i className="fa-solid fa-scale-balanced text-[#00786f] mr-2"></i> TripSplit
          </div>

          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-[#00786f] to-[#00A69C] rounded-xl p-4 flex items-center text-white mb-10 shadow-lg shadow-purple-200 cursor-pointer transition transform hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white/20 overflow-hidden bg-white shadow-inner shrink-0">
               <img src="/user.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
               <p className="font-bold text-sm leading-tight">{userName}</p>
            </div>
          </div>

          <h3 className="text-gray-400 font-semibold mb-4 text-sm">Groups</h3>
          <ul className="space-y-2">
            {trips.map(trip => (
              <li key={trip._id} onClick={() => navigate(`/trips/${trip._id}`)} className="bg-[#f0fdfa] text-[#00786f] font-medium py-3 px-4 rounded-lg cursor-pointer transition hover:bg-[#ccfbf1] flex items-center shadow-sm">
                 <i className="fa-solid fa-user-group text-xs mr-3"></i> {trip.name}
              </li>
            ))}
            {trips.length === 0 && <li className="text-sm text-gray-400 italic px-4">No groups yet</li>}
          </ul>
        </div>

        {/* Bottom Logout */}
        <div onClick={handleLogout} className="mt-8 flex items-center text-gray-500 font-semibold cursor-pointer hover:text-gray-800 transition bg-gray-50 py-3 px-4 rounded-lg">
           <i className="fa-solid fa-arrow-right-from-bracket mr-3"></i> Logout
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#f8fafc] rounded-tl-3xl shadow-inner overflow-y-auto p-8 border-t border-l border-[#e2e8f0]">
        
        {/* Header Search & Add */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 space-y-4 md:space-y-0">
           <div className="relative w-full max-w-xl">
             <input type="text" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-5 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00786f] focus:ring-1 focus:ring-[#00786f] bg-white text-gray-700 shadow-sm transition" />
           </div>
           <button onClick={() => setIsModalOpen(true)} className="bg-[#ccfbf1] text-[#00786f] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-[#99f6e4] transition transform hover:-translate-y-0.5 whitespace-nowrap">
             Add Group
           </button>
        </div>

        {/* Masonry Grid Body */}
        {loading ? <div className="text-center py-20 font-bold text-[#00786f]">Loading unified dashboard...</div> : 
         filteredTrips.length === 0 ? (
           <div className="flex justify-center items-center h-64 text-gray-400 italic">No matching groups found. Add one!</div>
         ) : (
           <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {filteredTrips.map(trip => {
                const isSettlementsView = activeTab[trip._id] === 'settlements';
                const localSettlements = calculateSettlements(trip.members, trip.expenses);
                const itemsToMap = isSettlementsView ? localSettlements : trip.expenses;

                return (
                  <div key={trip._id} className="bg-[#ffffff] rounded-xl p-5 break-inside-avoid shadow-sm border border-[#e2e8f0]">
                    <div className="flex justify-between items-center mb-5">
                       <div className="flex items-center gap-2 min-w-0">
                         <h3 className="text-xl font-bold text-[#0f172a] truncate cursor-pointer hover:underline" onClick={() => navigate(`/trips/${trip._id}`)}>{trip.name}</h3>
                         {/* Gap Fix #2: badge for trips shared with (but not owned by) this user */}
                         {trip.owner !== userId && (
                           <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100">Shared</span>
                         )}
                       </div>
                       <div className="flex space-x-2 text-gray-500">
                          {/* Toggle Settlements */}
                          <button onClick={() => toggleTab(trip._id)} title="Toggle Settlements" className={`w-8 h-8 rounded flex items-center justify-center transition ${isSettlementsView ? 'bg-[#00786f] text-white' : 'hover:bg-[#ccfbf1]'}`}>
                             <i className="fa-solid fa-scale-balanced"></i>
                          </button>
                          {/* Go to Group Dashboard instead of add inline */}
                          <button onClick={() => navigate(`/trips/${trip._id}`)} title="Add Expense" className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#ccfbf1] transition">
                             <i className="fa-solid fa-plus font-bold"></i>
                          </button>
                       </div>
                    </div>

                    <div className="space-y-3">
                       {itemsToMap.length === 0 ? (
                         <div className="bg-white rounded-lg p-3 text-sm text-gray-400 italic text-center">
                           No {isSettlementsView ? 'settlements' : 'expenses'} available.
                         </div>
                       ) : isSettlementsView ? (
                         /* Settlements Render */
                         localSettlements.map((s, idx) => (
                           <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#00786f] border border-transparent transition">
                              <div className="flex items-center text-sm font-semibold text-[#0f172a] space-x-2">
                                <span>{s.from}</span>
                                <i className="fa-solid fa-angles-right text-[10px] text-gray-400"></i>
                                <span>{s.to}</span>
                              </div>
                              <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#ccfbf1] text-[#004D46]">
                                ₹{s.amount.toFixed(2)}
                              </div>
                           </div>
                         ))
                       ) : (
                         /* Expenses Render */
                         trip.expenses.map((e, idx) => (
                           <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm border border-transparent cursor-pointer hover:border-[#00786f] transition">
                              <div className="flex items-center space-x-3">
                                 <div className="flex flex-col">
                                   <span className="text-sm font-semibold text-[#0f172a]">{e.description}</span>
                                   <div className="flex items-center mt-1 space-x-2">
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ccfbf1] text-[#004D46]">
                                        ₹{e.amount}
                                      </span>
                                      <span className="text-[10px] text-gray-500 font-medium">{e.payer}</span>
                                   </div>
                                 </div>
                              </div>
                              <i className="fa-solid fa-chevron-right text-gray-300 text-sm"></i>
                           </div>
                         ))
                       )}
                    </div>
                  </div>
                )
              })}
           </div>
         )}
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Group</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter a name for your new trip or shared group.</p>
            <input type="text" autoFocus value={newTripName} onChange={e => setNewTripName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitCreateTrip()} placeholder="e.g. Goa Trip, Apartment Bills" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00786f] transition mb-8 text-gray-700 font-medium" />
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setIsModalOpen(false); setNewTripName(''); }} className="px-5 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition">Cancel</button>
              <button onClick={submitCreateTrip} disabled={!newTripName.trim()} className="bg-[#00786f] text-white font-bold py-2 px-8 rounded-lg shadow-md disabled:opacity-50 hover:bg-[#005c55] disabled:hover:bg-[#00786f] transition">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
