const fs = require('fs');
const path = 'client/src/pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state variables
content = content.replace(
  "const [search, setSearch] = useState('');",
  `const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');`
);

// 2. Replace handleCreateTrip logic
content = content.replace(
  /const handleCreateTrip = async \(\) => {[\s\S]*?body: JSON.stringify\(\{ name, members: \[\] \}\)[\s\S]*?if \(response.ok\) {[\s\S]*?const newTrip = await response.json\(\);[\s\S]*?navigate\(`\/trips\/\$\{newTrip\._id\}`\);[\s\S]*?\}[\s\S]*?\} catch \(err\) \{\}[\s\S]*?};/,
  `const submitCreateTrip = async () => {
    const name = newTripName.trim();
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
        setIsModalOpen(false);
        setNewTripName('');
        navigate(\`/trips/\${newTrip._id}\`);
      }
    } catch (err) {}
  };`
);

// 3. Update button trigger
content = content.replace(
  '<button onClick={handleCreateTrip} className="bg-[#ccfbf1] text-[#00786f] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-[#99f6e4] transition transform hover:-translate-y-0.5 whitespace-nowrap">',
  '<button onClick={() => setIsModalOpen(true)} className="bg-[#ccfbf1] text-[#00786f] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-[#99f6e4] transition transform hover:-translate-y-0.5 whitespace-nowrap">'
);

// 4. Inject Modal HTML before final closing div
const modalHtml = `
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
  );`;

content = content.replace(/\s*<\/div>\s*\);\s*};\s*export default Dashboard;\s*$/, modalHtml + '\n};\nexport default Dashboard;\n');

fs.writeFileSync(path, content, 'utf8');
console.log('Dashboard Modal Installed!');
