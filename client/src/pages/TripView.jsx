
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TripView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Friend Input Form
  const [friendName, setFriendName] = useState('');
  // Gap Fix #2: tabbed add-member UI
  const [addMode, setAddMode] = useState('name'); // 'name' | 'email'
  const [inviteEmail, setInviteEmail] = useState('');
  const [memberFeedback, setMemberFeedback] = useState({ text: '', type: '' }); // inline feedback, replaces alert()

  // Expense Input Form
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitMode, setSplitMode] = useState('equal');
  
  // Custom Shares States
  const [involvedEqual, setInvolvedEqual] = useState([]); // Array of checked names
  const [exactShares, setExactShares] = useState({}); // { name: amount }

  const fetchTripData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrip(data.trip);
        setSettlements(data.settlements || []);
      } else {
        navigate('/dashboard');
      }
    } catch (err) { console.error(err); } 
      finally { setLoading(false); }
  };

  useEffect(() => { fetchTripData(); }, [tripId]);

  const handleAddFriend = async () => {
    const name = friendName.trim();
    if (!name) return;
    if (trip.members.includes(name)) {
      setMemberFeedback({ text: 'This name is already in the group.', type: 'error' });
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });
      setFriendName('');
      setMemberFeedback({ text: '', type: '' });
      fetchTripData();
    } catch (err) { console.error(err); }
  };

  const handleRemoveFriend = async (name) => {
    const isInvolved = trip.expenses.some(e => e.payer === name || Object.keys(e.shares || {}).includes(name));
    if (isInvolved) {
      setMemberFeedback({ text: `Cannot remove ${name} — they are involved in an expense.`, type: 'error' });
      return;
    }
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });
      setMemberFeedback({ text: '', type: '' });
      fetchTripData();
    } catch (err) { console.error(err); }
  };

  // Gap Fix #2: invite a registered user by email
  const handleInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMemberFeedback({ text: `${data.memberName} has been added to the group!`, type: 'success' });
        setInviteEmail('');
        fetchTripData();
      } else {
        setMemberFeedback({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMemberFeedback({ text: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  const handleAddExpense = async () => {
    const totalAmount = parseFloat(amount);
    if (!description || !totalAmount || !payer) return;

    let shares = {};
    if (splitMode === 'equal') {
      if (involvedEqual.length === 0) return;
      const splitAmount = totalAmount / involvedEqual.length;
      involvedEqual.forEach(f => shares[f] = splitAmount);
    } else {
      let sum = 0;
      Object.values(exactShares).forEach(v => sum += (parseFloat(v) || 0));
      if (Math.abs(sum - totalAmount) > 0.01) {
          alert('Exact amounts do not add up to total!'); return;
      }
      Object.entries(exactShares).forEach(([name, val]) => {
          if (parseFloat(val) > 0) shares[name] = parseFloat(val);
      });
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ description, amount: totalAmount, payer, shares })
      });
      
      if (response.ok) {
        setDescription(''); setAmount(''); setPayer('');
        setInvolvedEqual([]); setExactShares({});
        fetchTripData(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${tripId}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTripData();
    } catch (err) { console.error(err); }
  };

  // UI Calculations
  const friends = trip?.members || [];
  const expenses = trip?.expenses || [];
  const totalAmnt = parseFloat(amount) || 0;
  
  let exactSum = 0;
  Object.values(exactShares).forEach(v => exactSum += (parseFloat(v) || 0));
  const remaining = totalAmnt - exactSum;

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-teal-700">Loading Trip...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600 font-sans py-10 antialiased">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-sm text-teal-700 font-bold mb-2 flex items-center hover:underline">
              <i className="fa-solid fa-arrow-left mr-2"></i> Back to Dashboard
            </button>
            <h1 className="text-4xl font-extrabold text-slate-900">{trip.name}</h1>
          </div>
          <p className="text-gray-500 font-medium">{friends.length} Members • {expenses.length} Expenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Add Friend & Add Expense */}
          <div className="space-y-8">
            
            {/* ADD FRIEND CARD */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md transition">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                 <i className="fa-solid fa-user-plus text-[#00786f] mr-3"></i> Add Member
              </h2>

              {/* Gap Fix #2: Tab selector — By Name | Invite by Email */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => { setAddMode('name'); setMemberFeedback({ text: '', type: '' }); }}
                  className={`flex-1 py-2 text-sm font-bold transition ${
                    addMode === 'name'
                      ? 'text-teal-700 border-b-2 border-teal-700'
                      : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
                  }`}
                >
                  By Name
                </button>
                <button
                  onClick={() => { setAddMode('email'); setMemberFeedback({ text: '', type: '' }); }}
                  className={`flex-1 py-2 text-sm font-bold transition ${
                    addMode === 'email'
                      ? 'text-teal-700 border-b-2 border-teal-700'
                      : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
                  }`}
                >
                  <i className="fa-solid fa-envelope mr-1.5"></i> Invite by Email
                </button>
              </div>

              {addMode === 'name' ? (
                <div className="flex justify-between space-x-3 mb-3">
                  <input type="text" value={friendName} onChange={e => setFriendName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddFriend()} placeholder="Enter friend's name" className="flex-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700 transition" />
                  <button onClick={handleAddFriend} className="bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#156868] transition">Add</button>
                </div>
              ) : (
                <div className="flex justify-between space-x-3 mb-3">
                  <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInvite()} placeholder="friend@email.com" className="flex-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700 transition" />
                  <button onClick={handleInvite} className="bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#156868] transition">Invite</button>
                </div>
              )}

              {/* Inline feedback message — replaces all alert() calls */}
              {memberFeedback.text && (
                <p className={`text-sm mb-3 font-medium px-3 py-2 rounded-lg ${
                  memberFeedback.type === 'error'
                    ? 'text-red-600 bg-red-50 border border-red-100'
                    : 'text-teal-700 bg-teal-50 border border-teal-100'
                }`}>
                  <i className={`fa-solid ${memberFeedback.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} mr-2`}></i>
                  {memberFeedback.text}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                 {friends.map((f, i) => (
                    <span key={i} className="inline-flex items-center bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {f}
                        <button onClick={() => handleRemoveFriend(f)} className="ml-2 text-teal-500 hover:text-teal-800 transition">x</button>
                    </span>
                 ))}
                 {friends.length === 0 && <span className="text-xs text-gray-400 italic">No members added yet.</span>}
              </div>
            </div>

            {/* ADD EXPENSE CARD */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md transition">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <i className="fa-solid fa-receipt text-[#00786f] mr-3"></i> Add Expense
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Dinner" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Total Amount (₹)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Who Paid?</label>
                  <select value={payer} onChange={(e) => setPayer(e.target.value)} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-700 outline-none bg-white">
                    <option value="" disabled>Select friend...</option>
                    {friends.map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                
                {/* Split Modes */}
                <div>
                    <div className="flex space-x-2 mb-3 w-full border-b border-gray-200">
                        <button onClick={() => setSplitMode('equal')} className={`flex-1 py-2 px-3 text-sm font-bold transition ${splitMode === 'equal' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'}`}>Split Equally</button>
                        <button onClick={() => setSplitMode('exact')} className={`flex-1 py-2 px-3 text-sm font-bold transition ${splitMode === 'exact' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'}`}>Split Unequally</button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-48 overflow-y-auto space-y-2">
                        {friends.length === 0 ? <p className="text-sm text-gray-400 italic">Add friends to setup split.</p> : (
                            splitMode === 'equal' ? (
                                <>
                                    {friends.map((f, idx) => (
                                        <label key={idx} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition cursor-pointer">
                                            <input type="checkbox" checked={involvedEqual.includes(f)} onChange={(e) => {
                                                if (e.target.checked) setInvolvedEqual([...involvedEqual, f]);
                                                else setInvolvedEqual(involvedEqual.filter(name => name !== f));
                                            }} className="w-4 h-4 text-teal-700 bg-gray-100 border-gray-300 rounded focus:ring-teal-700 focus:ring-2" />
                                            <span className="text-sm font-medium text-slate-700">{f}</span>
                                        </label>
                                    ))}
                                    {involvedEqual.length > 0 && totalAmnt > 0 && (
                                        <div className="mt-3 text-right h-6"><span className="text-sm font-semibold text-teal-700 px-2 py-1 bg-teal-50 rounded border border-teal-100">₹{(totalAmnt / involvedEqual.length).toFixed(2)} per person</span></div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {friends.map((f, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded transition">
                                            <span className="text-sm font-medium text-slate-700 w-24 truncate">{f}</span>
                                            <div className="relative flex-1">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">₹</span>
                                                <input type="number" placeholder="0.00" value={exactShares[f] || ''} onChange={e => setExactShares({...exactShares, [f]: e.target.value})} className="pl-8 w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-700 text-sm bg-white" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-3 text-right h-6">
                                        {totalAmnt > 0 && (
                                            Math.abs(remaining) > 0.01 ? (
                                                remaining > 0 ? <span className="text-sm font-medium text-amber-600">Remaining: <span className="font-bold">₹{remaining.toFixed(2)}</span></span>
                                                : <span className="text-sm font-medium text-red-500">Over total by: <span className="font-bold">₹{Math.abs(remaining).toFixed(2)}</span></span>
                                            ) : <span className="text-sm font-semibold text-teal-700 px-2 py-1 bg-teal-50 rounded border border-teal-100">Match!</span>
                                        )}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>

                <button onClick={handleAddExpense} disabled={friends.length === 0 || !payer || totalAmnt <= 0 || (splitMode === 'equal' ? involvedEqual.length === 0 : Math.abs(remaining) > 0.01)} className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#156868] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settlements & History */}
          <div className="space-y-8">
            
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md transition">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                 <i className="fa-solid fa-handshake text-[#00786f] mr-3"></i> Settlement Summary
              </h2>
              <div className="space-y-3">
                {friends.length === 0 ? <div className="text-center py-8 text-gray-400 italic">Add friends and expenses to calculate settlements.</div> : 
                 expenses.length === 0 ? <div className="text-center py-8 text-gray-400 italic">No expenses yet. Everyone is settled up!</div> :
                 settlements.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-teal-700 bg-teal-50 rounded border border-teal-100">
                    <p className="font-bold">All settled up!</p>
                  </div>
                ) : (
                  settlements.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm uppercase">
                              {s.from.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{s.from}</span>
                              <span className="text-xs text-gray-500 text-left">owes</span>
                          </div>
                      </div>
                      
                      <div className="flex items-center px-4 font-bold text-teal-400">-&gt;</div>

                      <div className="flex items-center space-x-3 flex-1 justify-end">
                          <div className="flex flex-col items-end">
                              <span className="font-bold text-teal-700">₹{parseFloat(s.amount).toFixed(2)}</span>
                              <span className="text-xs text-slate-900 font-bold">{s.to}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm uppercase">
                              {s.to.charAt(0)}
                          </div>
                      </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md transition">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                 <i className="fa-solid fa-clock-rotate-left text-[#00786f] mr-3"></i> Recent Expenses
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {expenses.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 italic">No history.</p>
                ) : (
                  [...expenses].reverse().map((e, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-gray-50 p-3 border border-gray-100 rounded-lg hover:border-teal-200 transition group">
                       <div>
                         <h4 className="font-bold text-slate-900">{e.description}</h4>
                         <p className="text-xs text-gray-500">{e.payer} paid ₹{e.amount}</p>
                       </div>
                       <div className="flex flex-col items-end">
                         <button onClick={() => handleDeleteExpense(e._id)} className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 mb-1">x</button>
                         <span className="font-bold text-teal-700">₹{e.amount}</span>
                       </div>
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
