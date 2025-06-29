const axios = require('axios');
const { ConfigManager } = require('./config');
const { AuthManager } = require('./auth');

const configManager = new ConfigManager();
const authManager = new AuthManager(configManager);

async function makeAuthenticatedRequest(url, options = {}) {
  const authData = await authManager.getToken(true); // Auto-refresh if needed
  
  if (!authData) {
    throw new Error('No authentication token found. Please run login command first.');
  }

  // Determine base URL based on provider
  let baseUrl;
  switch (authData.provider) {
    case 'github':
      baseUrl = 'https://api.github.com';
      break;
    case 'google':
      baseUrl = 'https://www.googleapis.com';
      break;
    case 'discord':
      baseUrl = 'https://discord.com/api/v10';
      break;
    default:
      baseUrl = options.baseUrl || '';
  }

  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const config = {
    ...options,
    headers: {
      'Authorization': `Bearer ${authData.access_token}`,
      'Accept': 'application/json',
      ...options.headers
    }
  };

  try {
    return await axios(fullUrl, config);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token might be invalid, try to refresh
      try {
        const refreshedAuthData = await authManager.getToken(true);
        if (refreshedAuthData && refreshedAuthData.access_token !== authData.access_token) {
          // Token was refreshed, retry the request
          config.headers['Authorization'] = `Bearer ${refreshedAuthData.access_token}`;
          return await axios(fullUrl, config);
        }
      } catch (refreshError) {
        // Refresh failed, throw original error
      }
    }
    throw error;
  }
}

module.exports = {
  makeAuthenticatedRequest
};