const express = require('express');
const axios = require('axios');
const open = require('open');
const crypto = require('crypto');
const { URLSearchParams } = require('url');

class AuthManager {
  constructor(configManager) {
    this.config = configManager;
    this.providers = {
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userUrl: 'https://api.github.com/user',
        clientId: process.env.GITHUB_CLIENT_ID || this.config.get('oauth.github.clientId'),
        clientSecret: process.env.GITHUB_CLIENT_SECRET || this.config.get('oauth.github.clientSecret'),
        defaultScopes: ['user:email']
      },
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        clientId: process.env.GOOGLE_CLIENT_ID || this.config.get('oauth.google.clientId'),
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || this.config.get('oauth.google.clientSecret'),
        defaultScopes: ['openid', 'email', 'profile']
      },
      discord: {
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        userUrl: 'https://discord.com/api/users/@me',
        clientId: process.env.DISCORD_CLIENT_ID || this.config.get('oauth.discord.clientId'),
        clientSecret: process.env.DISCORD_CLIENT_SECRET || this.config.get('oauth.discord.clientSecret'),
        defaultScopes: ['identify', 'email']
      }
    };
  }

  async login(provider, scopes) {
    const providerConfig = this.providers[provider];
    if (!providerConfig) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!providerConfig.clientId || !providerConfig.clientSecret) {
      throw new Error(`Missing OAuth configuration for ${provider}. Set environment variables or use 'buttondown-cli config --set oauth.${provider}.clientId=...' and 'buttondown-cli config --set oauth.${provider}.clientSecret=...'`);
    }

    const redirectUri = 'http://localhost:3000/callback';
    const state = crypto.randomBytes(16).toString('hex');
    const scopeList = scopes || providerConfig.defaultScopes;

    // Start local server to handle callback
    const { server, authPromise } = this.startCallbackServer(state);

    try {
      // Build authorization URL
      const authParams = new URLSearchParams({
        client_id: providerConfig.clientId,
        redirect_uri: redirectUri,
        scope: scopeList.join(' '),
        state: state,
        response_type: 'code'
      });

      const authUrl = `${providerConfig.authUrl}?${authParams.toString()}`;

      // Open browser
      await open(authUrl);
      console.log(`If browser doesn't open automatically, visit: ${authUrl}`);

      // Wait for callback
      const { code } = await authPromise;

      // Exchange code for token
      const tokenResponse = await this.exchangeCodeForToken(provider, code, redirectUri);
      
      // Get user info
      const userResponse = await this.getUserInfo(provider, tokenResponse.access_token);
      
      // Store authentication data
      const authData = {
        provider,
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_at: tokenResponse.expires_in ? Date.now() + (tokenResponse.expires_in * 1000) : null,
        scopes: scopeList,
        user: {
          ...userResponse,
          provider
        }
      };

      this.config.set('auth', authData);

      return authData;

    } finally {
      server.close();
    }
  }

  startCallbackServer(expectedState) {
    const app = express();
    let server;
    let resolveAuth, rejectAuth;

    const authPromise = new Promise((resolve, reject) => {
      resolveAuth = resolve;
      rejectAuth = reject;
    });

    app.get('/callback', (req, res) => {
      const { code, state, error } = req.query;

      if (error) {
        res.send(`<h1>Authentication Error</h1><p>${error}</p><script>window.close();</script>`);
        rejectAuth(new Error(`OAuth error: ${error}`));
        return;
      }

      if (state !== expectedState) {
        res.send('<h1>Authentication Error</h1><p>Invalid state parameter</p><script>window.close();</script>');
        rejectAuth(new Error('Invalid state parameter'));
        return;
      }

      if (!code) {
        res.send('<h1>Authentication Error</h1><p>No authorization code received</p><script>window.close();</script>');
        rejectAuth(new Error('No authorization code received'));
        return;
      }

      res.send('<h1>Authentication Successful!</h1><p>You can close this window.</p><script>window.close();</script>');
      resolveAuth({ code });
    });

    server = app.listen(3000, 'localhost');

    return { server, authPromise };
  }

  async exchangeCodeForToken(provider, code, redirectUri) {
    const providerConfig = this.providers[provider];
    
    const tokenParams = new URLSearchParams({
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      code: code,
      redirect_uri: redirectUri
    });

    // Add grant_type for providers that require it
    if (provider === 'google' || provider === 'discord') {
      tokenParams.append('grant_type', 'authorization_code');
    }

    const response = await axios.post(providerConfig.tokenUrl, tokenParams, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  }

  async getUserInfo(provider, accessToken) {
    const providerConfig = this.providers[provider];
    
    const response = await axios.get(providerConfig.userUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.data;
  }

  async logout() {
    this.config.delete('auth');
  }

  async getCurrentUser() {
    const authData = this.config.get('auth');
    return authData?.user || null;
  }

  async getToken(refresh = false) {
    let authData = this.config.get('auth');
    if (!authData) {
      return null;
    }

    // Check if token is expired and refresh if possible
    if (refresh && authData.refresh_token && authData.expires_at && Date.now() > authData.expires_at) {
      try {
        authData = await this.refreshToken(authData);
      } catch (error) {
        throw new Error(`Failed to refresh token: ${error.message}`);
      }
    }

    return authData;
  }

  async refreshToken(authData) {
    const providerConfig = this.providers[authData.provider];
    if (!providerConfig) {
      throw new Error(`Unsupported provider: ${authData.provider}`);
    }

    const tokenParams = new URLSearchParams({
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      refresh_token: authData.refresh_token,
      grant_type: 'refresh_token'
    });

    const response = await axios.post(providerConfig.tokenUrl, tokenParams, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const newAuthData = {
      ...authData,
      access_token: response.data.access_token,
      expires_at: response.data.expires_in ? Date.now() + (response.data.expires_in * 1000) : null
    };

    if (response.data.refresh_token) {
      newAuthData.refresh_token = response.data.refresh_token;
    }

    this.config.set('auth', newAuthData);
    return newAuthData;
  }
}

module.exports = { AuthManager };