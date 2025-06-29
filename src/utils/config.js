const Configstore = require('configstore').default;
const pkg = require('../../package.json');

class ConfigManager {
  constructor() {
    this.config = new Configstore(pkg.name);
  }

  get(key) {
    return this.config.get(key);
  }

  set(key, value) {
    this.config.set(key, value);
  }

  delete(key) {
    const existed = this.config.has(key);
    this.config.delete(key);
    return existed;
  }

  getAll() {
    return this.config.all;
  }

  clear() {
    this.config.clear();
  }

  has(key) {
    return this.config.has(key);
  }
}

module.exports = { ConfigManager };