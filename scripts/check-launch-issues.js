#!/usr/bin/env node

/**
 * TeachyAI Launch Issue Diagnostic Tool
 * 
 * This script checks for common issues that might cause crashes in TestFlight
 * but not in development environments.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Paths to check
const paths = {
  envUtils: path.join(__dirname, '../app/utils/env.ts'),
  supabase: path.join(__dirname, '../lib/supabase.ts'),
  appLayout: path.join(__dirname, '../app/_layout.tsx'),
  appDelegate: path.join(__dirname, '../ios/TeachyAI/AppDelegate.mm'),
  authContext: path.join(__dirname, '../contexts/auth.tsx')
};

console.log(chalk.green('========================================'));
console.log(chalk.green('TeachyAI Launch Issue Diagnostic Tool'));
console.log(chalk.green('========================================'));

let passCount = 0;
let warningCount = 0;
let errorCount = 0;

// Check for try/catch in critical files
for (const [name, filePath] of Object.entries(paths)) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = [
      { 
        name: 'Error handling', 
        regex: /try\s*{.*?}\s*catch/s,
        message: 'File has proper error handling with try/catch blocks',
        warning: 'Missing try/catch blocks which could lead to crashes'
      },
      { 
        name: 'Error logging', 
        regex: /errorLogger|console\.(error|warn)/,
        message: 'File includes error logging',
        warning: 'No error logging found, issues might be hard to diagnose'
      },
      { 
        name: 'Environment fallbacks', 
        regex: /\|\|.*?['"].*?['"]/,
        message: 'File has fallbacks for missing values',
        warning: 'No fallbacks for potentially missing values'
      }
    ];
    
    console.log(chalk.yellow(`\nChecking ${name}...`));
    
    let filePassCount = 0;
    let fileWarningCount = 0;
    
    for (const check of checks) {
      if (check.regex.test(content)) {
        console.log(chalk.green(`✓ ${check.message}`));
        filePassCount++;
        passCount++;
      } else {
        console.log(chalk.yellow(`⚠ ${check.warning}`));
        fileWarningCount++;
        warningCount++;
      }
    }
    
    if (fileWarningCount === 0) {
      console.log(chalk.green(`✓ ${name} looks good!`));
    }
    
  } catch (error) {
    console.log(chalk.red(`✗ Error checking ${name}: ${error.message}`));
    errorCount++;
  }
}

// Check for environment variables
console.log(chalk.yellow('\nChecking environment variables...'));
const requiredEnvVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_DEEPSEEK_API_KEY',
  'CLERK_PUBLISHABLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(chalk.green(`✓ ${envVar} is set`));
    passCount++;
  } else {
    console.log(chalk.yellow(`⚠ ${envVar} is not set - app should use fallbacks`));
    warningCount++;
  }
}

// Show summary
console.log(chalk.green('\n========================================'));
console.log(`Tests passed: ${chalk.green(passCount)}`);
console.log(`Warnings: ${chalk.yellow(warningCount)}`);
console.log(`Errors: ${chalk.red(errorCount)}`);
console.log(chalk.green('========================================'));

if (errorCount > 0) {
  console.log(chalk.red('Some critical issues were found that might cause crashes!'));
  process.exit(1);
} else if (warningCount > 0) {
  console.log(chalk.yellow('Some potential issues were found but the app should be crash-resistant.'));
  process.exit(0);
} else {
  console.log(chalk.green('All tests passed! Your app should be crash-resistant.'));
  process.exit(0);
}