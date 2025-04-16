import fs from 'node:fs';
import { resolve } from 'node:path';

const base = process.cwd();
// Read package.json
const packageJsonPath = resolve(base, 'package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the current date in YYYY.MM.DD format
const now = new Date();
const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

// Generate the app version
const appVersion = `${packageJson.version}-${formattedDate}`;

// Create the JSON object
const outputJson = {
    "APP_VERSION": appVersion
};

// Write to a JSON file
const outputPath = resolve(base, 'src/app_version.json');
fs.writeFileSync(outputPath, JSON.stringify(outputJson, null, 2));

console.log(`App version file created: ${outputPath}`);
