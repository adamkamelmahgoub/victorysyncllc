const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Update the dev script to use our working solution
packageJson.scripts.dev = 'node dev-server.mjs';

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json dev script to use dev-server.mjs');