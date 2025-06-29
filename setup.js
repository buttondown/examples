#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { ConfigManager } = require('./src/utils/config');

const configManager = new ConfigManager();

console.log(chalk.blue.bold('\n🔐 OAuth CLI Setup\n'));

async function setupOAuth() {
  console.log(chalk.yellow('This setup will help you configure OAuth providers for the CLI.\n'));
  
  const { providers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'providers',
      message: 'Which OAuth providers would you like to configure?',
      choices: [
        { name: 'GitHub', value: 'github' },
        { name: 'Google', value: 'google' },
        { name: 'Discord', value: 'discord' }
      ]
    }
  ]);

  for (const provider of providers) {
    console.log(chalk.cyan(`\n📝 Configuring ${provider.charAt(0).toUpperCase() + provider.slice(1)}...\n`));
    
    let instructions = '';
    switch (provider) {
      case 'github':
        instructions = `
1. Go to: ${chalk.underline('https://github.com/settings/applications/new')}
2. Fill in the application details:
   - Application name: Your CLI App
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: ${chalk.green('http://localhost:3000/callback')}
3. Click "Register application"
4. Copy the Client ID and Client Secret`;
        break;
      case 'google':
        instructions = `
1. Go to: ${chalk.underline('https://console.developers.google.com/')}
2. Create a new project or select existing
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set Application type to "Desktop application"
6. Add redirect URI: ${chalk.green('http://localhost:3000/callback')}
7. Copy the Client ID and Client Secret`;
        break;
      case 'discord':
        instructions = `
1. Go to: ${chalk.underline('https://discord.com/developers/applications')}
2. Click "New Application"
3. Give it a name and create
4. Go to OAuth2 section in the sidebar
5. Add redirect URI: ${chalk.green('http://localhost:3000/callback')}
6. Copy the Client ID and Client Secret`;
        break;
    }

    console.log(chalk.gray(instructions));
    console.log();

    const { clientId, clientSecret } = await inquirer.prompt([
      {
        type: 'input',
        name: 'clientId',
        message: `Enter your ${provider} Client ID:`,
        validate: input => input.length > 0 || 'Client ID is required'
      },
      {
        type: 'password',
        name: 'clientSecret',
        message: `Enter your ${provider} Client Secret:`,
        validate: input => input.length > 0 || 'Client Secret is required'
      }
    ]);

    configManager.set(`oauth.${provider}.clientId`, clientId);
    configManager.set(`oauth.${provider}.clientSecret`, clientSecret);
    
    console.log(chalk.green(`✓ ${provider} configuration saved!\n`));
  }

  console.log(chalk.green.bold('🎉 Setup complete!\n'));
  console.log(chalk.blue('You can now use the following commands:'));
  console.log(chalk.gray('  node src/cli.js login --provider github'));
  console.log(chalk.gray('  node src/cli.js login --provider google'));
  console.log(chalk.gray('  node src/cli.js login --provider discord'));
  console.log(chalk.gray('  node src/cli.js whoami'));
  console.log(chalk.gray('  node src/cli.js profile\n'));
  
  console.log(chalk.yellow('Note: Make sure to keep your client secrets secure and never commit them to version control!'));
}

setupOAuth().catch(console.error);