const chalk = require('chalk');
const ora = require('ora');
const { AuthManager } = require('../utils/auth');
const { ConfigManager } = require('../utils/config');

const configManager = new ConfigManager();
const authManager = new AuthManager(configManager);

async function login(options) {
  const { provider, scopes } = options;
  
  const spinner = ora(`Starting OAuth login with ${provider}...`).start();
  
  try {
    const scopesArray = scopes ? scopes.split(',').map(s => s.trim()) : undefined;
    const result = await authManager.login(provider, scopesArray);
    
    spinner.succeed(chalk.green(`✓ Successfully authenticated with ${provider}`));
    console.log(chalk.blue(`Welcome, ${result.user.name || result.user.login || result.user.email}!`));
    
    if (result.user.avatar_url) {
      console.log(chalk.gray(`Avatar: ${result.user.avatar_url}`));
    }
    
  } catch (error) {
    spinner.fail(chalk.red(`✗ Authentication failed: ${error.message}`));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

async function logout() {
  const spinner = ora('Logging out...').start();
  
  try {
    await authManager.logout();
    spinner.succeed(chalk.green('✓ Successfully logged out'));
  } catch (error) {
    spinner.fail(chalk.red(`✗ Logout failed: ${error.message}`));
    process.exit(1);
  }
}

async function whoami() {
  try {
    const user = await authManager.getCurrentUser();
    if (user) {
      console.log(chalk.green('Authenticated as:'));
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Email: ${user.email || 'N/A'}`);
      console.log(`  Username: ${user.login || user.username || 'N/A'}`);
      console.log(`  Provider: ${user.provider || 'N/A'}`);
    } else {
      console.log(chalk.yellow('Not authenticated. Run `buttondown-cli login` to authenticate.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

async function token(options) {
  try {
    const tokenInfo = await authManager.getToken(options.refresh);
    if (tokenInfo) {
      console.log(chalk.green('Access Token:'));
      console.log(tokenInfo.access_token);
      
      if (tokenInfo.expires_at) {
        const expiresAt = new Date(tokenInfo.expires_at);
        const now = new Date();
        const isExpired = expiresAt < now;
        
        console.log(chalk.gray(`Expires: ${expiresAt.toISOString()} ${isExpired ? '(EXPIRED)' : ''}`));
      }
      
      if (tokenInfo.scopes) {
        console.log(chalk.gray(`Scopes: ${tokenInfo.scopes.join(', ')}`));
      }
    } else {
      console.log(chalk.yellow('No token found. Run `buttondown-cli login` to authenticate.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = {
  login,
  logout,
  whoami,
  token
};