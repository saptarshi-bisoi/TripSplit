const fs = require('fs');

const authPath = 'client/src/components/AuthPage.jsx';
let auth = fs.readFileSync(authPath, 'utf8');
auth = auth.replace(
  /<Link to="\/" className="text-3xl font-extrabold tracking-tight">\s*<span className="text-slate-900">Trip<\/span><span className="text-\[#00786f\]">Split<\/span>\s*<\/Link>/,
  '<Link to="/" className="inline-block">\n              <img src="/logo4.webp" alt="TripSplit Logo" className="h-10 w-auto mx-auto" />\n            </Link>'
);
fs.writeFileSync(authPath, auth);

const landingPath = 'client/src/components/LandingPage.jsx';
let landing = fs.readFileSync(landingPath, 'utf8');
landing = landing.replace(
  /<div className="text-2xl font-extrabold tracking-tight">\s*<span className="text-teal-700">Trip<\/span><span className="text-slate-900">Split<\/span>\s*<\/div>/,
  '<div className="flex items-center cursor-pointer" onClick={() => window.location.href="/"}>\n          <img src="/logo4.webp" alt="TripSplit Logo" className="h-8 w-auto" />\n        </div>'
);
fs.writeFileSync(landingPath, landing);

const dashboardPath = 'client/src/pages/Dashboard.jsx';
let dashboard = fs.readFileSync(dashboardPath, 'utf8');
dashboard = dashboard.replace(
  /<div className="flex items-center text-xl font-extrabold text-slate-900 mb-10 cursor-pointer" onClick={\(\) => navigate\('\/'\)}>\s*<i className="fa-solid fa-scale-balanced mr-2"><\/i> TripSplit\s*<\/div>/,
  '<div className="flex items-center mb-10 cursor-pointer" onClick={() => navigate(\'/\')}>\n             <img src="/logo4.webp" alt="TripSplit Logo" className="h-8 w-auto" />\n          </div>'
);
fs.writeFileSync(dashboardPath, dashboard);

console.log('Logos swapped');
