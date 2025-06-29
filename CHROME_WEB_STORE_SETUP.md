# Chrome Web Store Automated Publishing Setup

This guide will help you set up automated publishing to Chrome Web Store using GitHub Actions.

## Step 1: Get Chrome Web Store API Credentials

### 1.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Search "Chrome Web Store API" and enable it

### 1.2 Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. Select "External" → Create
3. Fill required fields:
   - App name: "Omnisearch Extension Publisher"
   - User support email: your email
   - Developer contact information: your email
4. Click "Save and Continue" (skip Scopes)
5. Add your email to "Test users"
6. Click "Save and Continue"

### 1.3 Create OAuth Credentials
1. Go to "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name: "Chrome Web Store Publisher"
5. Add to Authorized redirect URIs: `https://developers.google.com/oauthplayground`
6. Click "Create"
7. **SAVE** the Client ID and Client Secret

### 1.4 Get Refresh Token
1. Open https://developers.google.com/oauthplayground
2. Click settings icon (top right) → "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In "Input your own scopes" field, add: `https://www.googleapis.com/auth/chromewebstore`
5. Click "Authorize APIs"
6. Sign in with your Google Account
7. Click "Exchange authorization code for tokens"
8. **SAVE** the Refresh Token

### 1.5 Get Extension ID
1. Go to https://chrome.google.com/webstore/devconsole/
2. Click on your "Omnisearch" extension
3. Copy the Extension ID from the URL (32-character string)

## Step 2: Set GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `CHROME_CLIENT_ID` | Your OAuth Client ID |
| `CHROME_CLIENT_SECRET` | Your OAuth Client Secret |
| `CHROME_REFRESH_TOKEN` | Your Refresh Token |
| `CHROME_EXTENSION_ID` | Your Extension ID |

## Step 3: How to Use

### Automatic Publishing
1. Update version in `manifest.json` (e.g., "1.2.4" → "1.2.5")
2. Commit and push changes
3. Create a new tag: `git tag v1.2.5`
4. Push the tag: `git push origin v1.2.5`
5. GitHub Actions will automatically:
   - Package the extension
   - Upload to Chrome Web Store
   - Publish it live
   - Create a GitHub release

### Manual Trigger (Alternative)
You can also manually trigger releases from GitHub Actions tab.

## Troubleshooting

### Common Issues:
- **401 Unauthorized**: Check if your refresh token is valid
- **403 Forbidden**: Ensure Chrome Web Store API is enabled
- **Extension not found**: Verify your Extension ID is correct
- **Version error**: Make sure version in manifest.json is higher than current

### Token Expiration:
Google refresh tokens can expire after 6 months of inactivity. If this happens:
1. Repeat Step 1.4 to get a new refresh token
2. Update the `CHROME_REFRESH_TOKEN` secret in GitHub

## Security Notes
- Never commit API credentials to your repository
- Use GitHub Secrets for all sensitive data
- Refresh tokens should be treated as passwords
- Consider setting up token rotation if needed 