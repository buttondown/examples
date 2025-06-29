# Buttondown CLI

A command-line interface with OAuth authentication support for GitHub, Google, and Discord.

## Features

- 🔐 OAuth authentication with multiple providers
- 🔄 Automatic token refresh
- 📝 Configuration management
- 🌐 Authenticated API requests
- 💾 Secure credential storage

## Installation

```bash
npm install
npm link  # Or: chmod +x src/cli.js && ln -s $(pwd)/src/cli.js /usr/local/bin/buttondown-cli
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure your OAuth applications:

```bash
cp .env.example .env
```

### OAuth Application Setup

#### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - Authorization callback URL: `http://localhost:3000/callback`
3. Add your Client ID and Client Secret to `.env` or use the config command

#### Google
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API
4. Create OAuth 2.0 credentials with:
   - Authorized redirect URI: `http://localhost:3000/callback`
5. Add your Client ID and Client Secret to `.env` or use the config command

#### Discord
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section and add:
   - Redirect URI: `http://localhost:3000/callback`
4. Add your Client ID and Client Secret to `.env` or use the config command

### Alternative Configuration

You can also set OAuth credentials using the config command:

```bash
buttondown-cli config --set oauth.github.clientId=your_client_id
buttondown-cli config --set oauth.github.clientSecret=your_client_secret
```

## Usage

### Authentication Commands

```bash
# Login with GitHub (default)
buttondown-cli login

# Login with specific provider
buttondown-cli login --provider google
buttondown-cli login --provider discord

# Login with custom scopes
buttondown-cli login --provider github --scopes "user:email,repo"

# Check current user
buttondown-cli whoami

# Get access token
buttondown-cli token

# Refresh token
buttondown-cli token --refresh

# Logout
buttondown-cli logout
```

### Configuration Commands

```bash
# List all configuration
buttondown-cli config --list

# Set configuration value
buttondown-cli config --set key=value

# Get configuration value
buttondown-cli config --get key

# Delete configuration value
buttondown-cli config --delete key
```

### API Commands

```bash
# Get user profile (example authenticated API call)
buttondown-cli profile
```

## OAuth Providers

### GitHub
- **Default Scopes**: `user:email`
- **Available Scopes**: See [GitHub OAuth Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
- **API Base URL**: `https://api.github.com`

### Google
- **Default Scopes**: `openid email profile`
- **Available Scopes**: See [Google OAuth Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- **API Base URL**: `https://www.googleapis.com`

### Discord
- **Default Scopes**: `identify email`
- **Available Scopes**: See [Discord OAuth Scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes)
- **API Base URL**: `https://discord.com/api/v10`

## Security

- Credentials are stored securely using [configstore](https://github.com/yeoman/configstore)
- Access tokens are automatically refreshed when possible
- Local callback server runs only during authentication flow
- No credentials are logged or transmitted except to official OAuth endpoints

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Link for global usage
npm link
```

## API Integration

The CLI provides utilities for making authenticated API requests:

```javascript
const { makeAuthenticatedRequest } = require('./src/utils/api');

// Make authenticated request
const response = await makeAuthenticatedRequest('/user');
console.log(response.data);
```

## Troubleshooting

### Authentication Issues

1. **Missing OAuth configuration**: Set up your OAuth applications and configure client credentials
2. **Token expired**: Use `buttondown-cli token --refresh` or login again
3. **Scope issues**: Make sure your OAuth app has the required scopes configured

### Port Issues

If port 3000 is in use, the OAuth callback will fail. Make sure port 3000 is available during authentication.

### Browser Issues

If the browser doesn't open automatically, copy the displayed URL and paste it into your browser.

## License

MIT