const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content.trim());
}

// 1. calculations.js
const calculationsJs = `
export function calculateSettlements(members = [], expenses = []) {
    const balances = {};
    members.forEach(m => balances[m] = 0);
  
    expenses.forEach(expense => {
      if (!balances[expense.payer]) balances[expense.payer] = 0;
      balances[expense.payer] += expense.amount;
      
      const sharesObj = expense.shares || {};
      for (const [userId, share] of Object.entries(sharesObj)) {
        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= share;
      }
    });
  
    const creditors = [];
    const debtors = [];
    
    for (const [person, balance] of Object.entries(balances)) {
      if (balance > 0.01) creditors.push({ person, amount: balance });
      else if (balance < -0.01) debtors.push({ person, amount: Math.abs(balance) });
    }
  
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
  
    const settlements = [];
    let c = 0, d = 0;
  
    while (c < creditors.length && d < debtors.length) {
      const creditor = creditors[c];
      const debtor = debtors[d];
  
      const settleAmount = Math.min(creditor.amount, debtor.amount);
      
      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor.person,
          to: creditor.person,
          amount: parseFloat(settleAmount.toFixed(2))
        });
      }
  
      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;
  
      if (creditor.amount < 0.01) c++;
      if (debtor.amount < 0.01) d++;
    }
  
    return settlements;
}
`;
writeFile('client/src/utils/calculations.js', calculationsJs);


// 2. Dashboard.jsx Rewrite
const dashboardJsx = `
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateSettlements } from '../utils/calculations';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState({}); // { tripId: 'expenses' or 'settlements' }
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

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
      } catch (err) {} finally { setLoading(false); }
    };
    fetchTrips();
  }, [navigate]);

  const handleCreateTrip = async () => {
    const name = prompt('Enter Trip Name:');
    if (!name) return;

    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        },
        body: JSON.stringify({ name, members: [] }) 
      });
      if (response.ok) {
        const newTrip = await response.json();
        navigate(\`/trips/\${newTrip._id}\`);
      }
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
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
      <aside className="w-64 flex flex-col justify-between py-8 px-6 bg-white border-r border-[#f4f0f9]">
        <div>
          {/* Logo */}
          <div className="flex items-center text-xl font-extrabold text-slate-900 mb-10 cursor-pointer" onClick={() => navigate('/')}>
             <i className="fa-solid fa-scale-balanced mr-2"></i> TripSplit
          </div>

          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-[#6943af] to-[#7f5dbf] rounded-xl p-4 flex items-center text-white mb-10 shadow-lg shadow-purple-200 cursor-pointer transition transform hover:scale-[1.02]">
            <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center mr-3 bg-white/20">
               <i className="fa-regular fa-user"></i>
            </div>
            <div>
               <p className="font-bold text-sm leading-tight">{userName}</p>
            </div>
          </div>

          <h3 className="text-gray-400 font-semibold mb-4 text-sm">Groups</h3>
          <ul className="space-y-2">
            {trips.map(trip => (
              <li key={trip._id} onClick={() => navigate(\`/trips/\${trip._id}\`)} className="bg-[#efebfa] text-[#4b3589] font-medium py-3 px-4 rounded-lg cursor-pointer transition hover:bg-[#e4dcf4] flex items-center shadow-sm">
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
      <main className="flex-1 bg-[#fbf9fe] rounded-tl-3xl shadow-inner overflow-y-auto p-8 border-t border-l border-[#f4f0f9]">
        
        {/* Header Search & Add */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 space-y-4 md:space-y-0">
           <div className="relative w-full max-w-xl">
             <input type="text" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-5 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6943af] focus:ring-1 focus:ring-[#6943af] bg-white text-gray-700 shadow-sm transition" />
           </div>
           <button onClick={handleCreateTrip} className="bg-[#e4dcf4] text-[#6943af] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-[#d5c6f0] transition transform hover:-translate-y-0.5 whitespace-nowrap">
             Add Group
           </button>
        </div>

        {/* Masonry Grid Body */}
        {loading ? <div className="text-center py-20 font-bold text-[#6943af]">Loading unified dashboard...</div> : 
         filteredTrips.length === 0 ? (
           <div className="flex justify-center items-center h-64 text-gray-400 italic">No matching groups found. Add one!</div>
         ) : (
           <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {filteredTrips.map(trip => {
                const isSettlementsView = activeTab[trip._id] === 'settlements';
                const localSettlements = calculateSettlements(trip.members, trip.expenses);
                const itemsToMap = isSettlementsView ? localSettlements : trip.expenses;

                return (
                  <div key={trip._id} className="bg-[#f0eaf7] rounded-xl p-5 break-inside-avoid shadow-sm border border-[#e8dff2]">
                    <div className="flex justify-between items-center mb-5">
                       <h3 className="text-xl font-bold text-[#2d224d] truncate cursor-pointer hover:underline" onClick={() => navigate(\`/trips/\${trip._id}\`)}>{trip.name}</h3>
                       <div className="flex space-x-2 text-gray-500">
                          {/* Toggle Settlements */}
                          <button onClick={() => toggleTab(trip._id)} title="Toggle Settlements" className={\`w-8 h-8 rounded flex items-center justify-center transition \${isSettlementsView ? 'bg-[#6943af] text-white' : 'hover:bg-[#e4dcf4]'}\`}>
                             <i className="fa-solid fa-scale-balanced"></i>
                          </button>
                          {/* Go to Group Dashboard instead of add inline */}
                          <button onClick={() => navigate(\`/trips/\${trip._id}\`)} title="Add Expense" className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#e4dcf4] transition">
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
                           <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#6943af] border border-transparent transition">
                              <div className="flex items-center text-sm font-semibold text-[#2d224d] space-x-2">
                                <span>{s.from}</span>
                                <i className="fa-solid fa-angles-right text-[10px] text-gray-400"></i>
                                <span>{s.to}</span>
                              </div>
                              <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#fbcfe8] text-[#9d174d]">
                                ₹{s.amount.toFixed(2)}
                              </div>
                           </div>
                         ))
                       ) : (
                         /* Expenses Render */
                         trip.expenses.map((e, idx) => (
                           <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm border border-transparent cursor-pointer hover:border-[#6943af] transition">
                              <div className="flex items-center space-x-3">
                                 <div className="flex flex-col">
                                   <span className="text-sm font-semibold text-[#2d224d]">{e.description}</span>
                                   <div className="flex items-center mt-1 space-x-2">
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fbcfe8] text-[#9d174d]">
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
    </div>
  );
};
export default Dashboard;
`;
writeFile('client/src/pages/Dashboard.jsx', dashboardJsx);
console.log('Dashboard successfully redesigned!');
