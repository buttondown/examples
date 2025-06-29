const chalk = require('chalk');
const { ConfigManager } = require('../utils/config');

const configManager = new ConfigManager();

async function config(options) {
  try {
    if (options.list) {
      const config = configManager.getAll();
      console.log(chalk.green('Current configuration:'));
      
      if (Object.keys(config).length === 0) {
        console.log(chalk.gray('  (no configuration set)'));
      } else {
        Object.entries(config).forEach(([key, value]) => {
          // Hide sensitive values
          const displayValue = key.toLowerCase().includes('token') || key.toLowerCase().includes('secret') 
            ? '***' 
            : JSON.stringify(value);
          console.log(`  ${key}: ${displayValue}`);
        });
      }
      return;
    }
    
    if (options.set) {
      const [key, ...valueParts] = options.set.split('=');
      const value = valueParts.join('=');
      
      if (!key || !value) {
        console.error(chalk.red('Error: Invalid format. Use --set key=value'));
        process.exit(1);
      }
      
      // Try to parse as JSON if possible, otherwise store as string
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }
      
      configManager.set(key, parsedValue);
      console.log(chalk.green(`✓ Set ${key} = ${JSON.stringify(parsedValue)}`));
      return;
    }
    
    if (options.get) {
      const value = configManager.get(options.get);
      if (value !== undefined) {
        const displayValue = options.get.toLowerCase().includes('token') || options.get.toLowerCase().includes('secret') 
          ? '***' 
          : JSON.stringify(value);
        console.log(displayValue);
      } else {
        console.log(chalk.yellow(`Configuration key '${options.get}' not found`));
        process.exit(1);
      }
      return;
    }
    
    if (options.delete) {
      const existed = configManager.delete(options.delete);
      if (existed) {
        console.log(chalk.green(`✓ Deleted configuration key '${options.delete}'`));
      } else {
        console.log(chalk.yellow(`Configuration key '${options.delete}' not found`));
      }
      return;
    }
    
    // Default: show help
    console.log(chalk.blue('Configuration commands:'));
    console.log('  --list              List all configuration');
    console.log('  --set key=value     Set a configuration value');
    console.log('  --get key           Get a configuration value');
    console.log('  --delete key        Delete a configuration value');
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = {
  config
};