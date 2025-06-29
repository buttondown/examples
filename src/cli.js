#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const authCommands = require('./commands/auth');
const configCommands = require('./commands/config');
const pkg = require('../package.json');

const program = new Command();

program
  .name('buttondown-cli')
  .description('CLI tool with OAuth authentication support')
  .version(pkg.version);

// Auth commands
program
  .command('login')
  .description('Authenticate via OAuth')
  .option('-p, --provider <provider>', 'OAuth provider (github, google, discord)', 'github')
  .option('-s, --scopes <scopes>', 'OAuth scopes (comma-separated)')
  .action(authCommands.login);

program
  .command('logout')
  .description('Remove stored authentication')
  .action(authCommands.logout);

program
  .command('whoami')
  .description('Show current authenticated user')
  .action(authCommands.whoami);

program
  .command('token')
  .description('Show current access token')
  .option('-r, --refresh', 'Refresh the token if possible')
  .action(authCommands.token);

// Config commands
program
  .command('config')
  .description('Manage configuration')
  .option('-l, --list', 'List current configuration')
  .option('-s, --set <key=value>', 'Set a configuration value')
  .option('-g, --get <key>', 'Get a configuration value')
  .option('-d, --delete <key>', 'Delete a configuration value')
  .action(configCommands.config);

// Example API command to demonstrate authenticated requests
program
  .command('profile')
  .description('Get user profile (requires authentication)')
  .action(async () => {
    const { makeAuthenticatedRequest } = require('./utils/api');
    try {
      const response = await makeAuthenticatedRequest('/user');
      console.log(chalk.green('Profile:'), JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      if (error.response?.status === 401) {
        console.log(chalk.yellow('Try running: buttondown-cli login'));
      }
    }
  });

program.parse();