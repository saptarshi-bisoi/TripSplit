const fs = require('fs');

const frontendFiles = [
  'client/src/components/AuthPage.jsx',
  'client/src/pages/Dashboard.jsx',
  'client/src/pages/TripView.jsx'
];

frontendFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace direct string literals: 'http://localhost:5000/api...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api...`
  // Specifically, look for fetch('http://localhost:5000... or fetch(`http://localhost:5000...
  
  content = content.replace(/'http:\/\/localhost:5000(\/api[^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  content = content.replace(/`http:\/\/localhost:5000(\/api[^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  fs.writeFileSync(file, content);
});

console.log('Frontend URLs successfully prepped for Render!');
