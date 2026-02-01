const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'dist', 'index.html');
const dest = path.join(__dirname, '..', 'dist', '404.html');
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Created dist/404.html for GitHub Pages SPA routing');
}
