const fs = require('fs');

const authPagePath = 'client/src/components/AuthPage.jsx';
let authPageContent = fs.readFileSync(authPagePath, 'utf8');

// Replace purples with the teal #00786f
authPageContent = authPageContent
  .replace(/#6943af/g, '#00786f')
  .replace(/#5b389f/g, '#005C55') // hover color
  .replace(/#f3f0f9/g, '#f8fafc'); // very light slate

fs.writeFileSync(authPagePath, authPageContent);

const dashboardPath = 'client/src/pages/Dashboard.jsx';
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// The Purples: 
// #6943af -> #00786f (Primary)
// #7f5dbf -> #00A69C (Gradient Light)
// #4b3589 -> #004D46 (Dark Text)
// #efebfa -> #ccfbf1 (Active Nav Bg - teal-100)
// #e4dcf4 -> #99f6e4 (Hover Nav Bg - teal-200)
// #fbf9fe -> #f8fafc (Main Background - slate-50)
// #f4f0f9 -> #f1f5f9 (Borders - slate-100)
// #f0eaf7 -> #ffffff (Card bg - white)
// #e8dff2 -> #e2e8f0 (Card border - slate-200)
// #2d224d -> #0f172a (Primary dark text - slate-900)
// #d5c6f0 -> #5eead4 (Hover btn - teal-300)

dashboardContent = dashboardContent
  .replace(/#6943af/g, '#00786f')
  .replace(/#7f5dbf/g, '#00A69C')
  .replace(/#4b3589/g, '#00786f')
  .replace(/#efebfa/g, '#f0fdfa') // teal-50
  .replace(/#e4dcf4/g, '#ccfbf1') // teal-100
  .replace(/#fbf9fe/g, '#f8fafc') // slate-50
  .replace(/#f4f0f9/g, '#e2e8f0') // slate-200
  .replace(/#f0eaf7/g, '#ffffff') // card white
  .replace(/#e8dff2/g, '#e2e8f0') // card border slate-200
  .replace(/#2d224d/g, '#0f172a') // deep slate
  .replace(/#d5c6f0/g, '#99f6e4'); // teal-200

// I'll leave the #fbcfe8 (pink price pill) alone as it's a nice accent color, 
// or I can change it to a contrasting color. The user prefers `#00786f`. Let's let the pink stay.
// Actually let's make the pill light teal to align strictly:
// #fbcfe8 -> #ccfbf1 (teal-100)
// #9d174d -> #004D46 (dark teal text)
dashboardContent = dashboardContent
  .replace(/#fbcfe8/g, '#ccfbf1')
  .replace(/#9d174d/g, '#004D46');

fs.writeFileSync(dashboardPath, dashboardContent);

console.log('Theme successfully reverted to teal (#00786f)');
