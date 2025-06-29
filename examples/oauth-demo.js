#!/usr/bin/env node

const chalk = require('chalk');
const { ConfigManager } = require('../src/utils/config');
const { AuthManager } = require('../src/utils/auth');
const { makeAuthenticatedRequest } = require('../src/utils/api');

async function demonstrateOAuth() {
  console.log(chalk.blue.bold('\n🔐 OAuth CLI Demonstration\n'));

  const configManager = new ConfigManager();
  const authManager = new AuthManager(configManager);

  try {
    // Check if user is already authenticated
    const currentUser = await authManager.getCurrentUser();
    
    if (currentUser) {
      console.log(chalk.green('✓ Already authenticated!'));
      console.log(chalk.gray(`User: ${currentUser.name || currentUser.login || currentUser.email}`));
      console.log(chalk.gray(`Provider: ${currentUser.provider}\n`));

      // Demonstrate authenticated API call
      console.log(chalk.blue('Making authenticated API request...\n'));
      
      try {
        const response = await makeAuthenticatedRequest('/user');
        console.log(chalk.green('API Response:'));
        console.log(JSON.stringify(response.data, null, 2));
      } catch (apiError) {
        console.error(chalk.red('API Error:'), apiError.message);
        if (apiError.response?.status === 401) {
          console.log(chalk.yellow('Token may have expired. Try refreshing or logging in again.'));
        }
      }
      
    } else {
      console.log(chalk.yellow('Not authenticated.'));
      console.log(chalk.gray('Run one of these commands to authenticate:'));
      console.log(chalk.gray('  node src/cli.js login --provider github'));
      console.log(chalk.gray('  node src/cli.js login --provider google'));
      console.log(chalk.gray('  node src/cli.js login --provider discord'));
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }
}

// Run the demonstration
demonstrateOAuth();