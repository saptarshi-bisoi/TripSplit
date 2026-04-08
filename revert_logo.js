const fs = require('fs');

// 1. AuthPage
const authPath = 'client/src/components/AuthPage.jsx';
let auth = fs.readFileSync(authPath, 'utf8');
auth = auth.replace(
  /<Link to="\/" className="inline-block">\s*<img src="\/logo4\.webp".*?\/>\s*<\/Link>/s,
  `<Link to="/" className="text-4xl font-extrabold tracking-tight">
              <span className="text-slate-900">Trip</span><span className="text-[#00786f]">Split</span>
            </Link>`
);
fs.writeFileSync(authPath, auth);

// 2. LandingPage
const landingPath = 'client/src/components/LandingPage.jsx';
let landing = fs.readFileSync(landingPath, 'utf8');
landing = landing.replace(
  /<div className="flex items-center cursor-pointer" onClick={\(\) => window\.location\.href="\/"}>\s*<img src="\/logo4\.webp".*?\/>\s*<\/div>/s,
  `<Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#00786f]">Trip</span><span className="text-slate-900">Split</span>
        </Link>`
);
fs.writeFileSync(landingPath, landing);

// 3. Dashboard
const dashboardPath = 'client/src/pages/Dashboard.jsx';
let dashboard = fs.readFileSync(dashboardPath, 'utf8');
dashboard = dashboard.replace(
  /<div className="flex items-center mb-10 cursor-pointer" onClick={\(\) => navigate\('\/'\)}>\s*<img src="\/logo4\.webp".*?\/>\s*<\/div>/s,
  `<div className="flex items-center text-xl font-extrabold text-slate-900 mb-10 cursor-pointer" onClick={() => navigate('/')}>
             <i className="fa-solid fa-scale-balanced text-[#00786f] mr-2"></i> TripSplit
          </div>`
);
fs.writeFileSync(dashboardPath, dashboard);

console.log('Logos reverted to text successfully!');
