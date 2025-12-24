#!/usr/bin/env node

/**
 * Verify Setup Script
 * This script checks if the development environment is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Logon Demo - Cloudbase Setup...\n');

let hasErrors = false;

// Check Node.js version
console.log('✓ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 16) {
  console.error('❌ Node.js version must be 16 or higher. Current version:', nodeVersion);
  hasErrors = true;
} else {
  console.log(`  ✓ Node.js version ${nodeVersion} is compatible\n`);
}

// Check package.json
console.log('✓ Checking package.json...');
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ package.json not found');
  hasErrors = true;
} else {
  console.log('  ✓ package.json exists\n');
}

// Check node_modules
console.log('✓ Checking dependencies...');
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.warn('⚠️  node_modules not found. Run: npm install');
  hasErrors = true;
} else {
  console.log('  ✓ Dependencies installed\n');
}

// Check .env file
console.log('✓ Checking environment configuration...');
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.warn('⚠️  .env file not found');
  console.log('  → Create .env from .env.example and add your Cloudbase environment ID');
  console.log('  → Run: cp .env.example .env\n');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  if (envContent.includes('your-env-id')) {
    console.warn('⚠️  .env file exists but contains placeholder values');
    console.log('  → Update VITE_CLOUDBASE_ENV with your actual Cloudbase environment ID\n');
    hasErrors = true;
  } else {
    console.log('  ✓ .env file configured\n');
  }
}

// Check critical files
console.log('✓ Checking critical files...');
const criticalFiles = [
  'electron/main.js',
  'electron/preload.js',
  'src/main.js',
  'src/App.vue',
  'index.html',
  'vite.config.js'
];

let allFilesExist = true;
criticalFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`  ❌ Missing file: ${file}`);
    allFilesExist = false;
    hasErrors = true;
  }
});

if (allFilesExist) {
  console.log('  ✓ All critical files present\n');
}

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasErrors) {
  console.log('⚠️  Setup verification completed with warnings/errors');
  console.log('   Please address the issues above before running the app\n');
  console.log('Quick fixes:');
  console.log('  1. Install dependencies: npm install');
  console.log('  2. Configure environment: cp .env.example .env');
  console.log('  3. Update .env with your Cloudbase credentials');
  console.log('  4. Run the app: npm run electron:dev\n');
  process.exit(1);
} else {
  console.log('✅ Setup verification passed!');
  console.log('   Your environment is ready to run the application\n');
  console.log('Next steps:');
  console.log('  • Run in development: npm run electron:dev');
  console.log('  • Build for production: npm run electron:build\n');
  process.exit(0);
}
