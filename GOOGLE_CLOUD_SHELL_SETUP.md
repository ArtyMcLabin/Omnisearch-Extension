# Google Cloud Shell Setup for Chrome Web Store API

This guide shows how to set up Chrome Web Store API credentials using Google Cloud Shell - no local setup required!

## Why Google Cloud Shell?

✅ **Pre-installed tools**: Python, gcloud CLI, curl, git  
✅ **No local setup**: Everything runs in the browser  
✅ **Google integrated**: Easy access to Google Cloud Console  
✅ **Free**: 5GB persistent storage, 50 hours/week usage  

## Step 1: Open Google Cloud Shell

1. Go to https://console.cloud.google.com/
2. Click the **Cloud Shell** icon (>_) in the top toolbar
3. Wait for the shell to initialize

## Step 2: Set Up Chrome Web Store API (In Cloud Shell)

### 2.1 Enable the API
```bash
# Set your project (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID

# Enable Chrome Web Store API
gcloud services enable chromewebstore.googleapis.com
```

### 2.2 Create OAuth Credentials
```bash
# Create OAuth client (web application)
gcloud auth application-default login

# Note: You'll need to create OAuth credentials manually in the console
# Go to: https://console.cloud.google.com/apis/credentials
```

**Manual step**: In the Google Cloud Console:
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Choose **Web application**
4. Add redirect URI: `https://developers.google.com/oauthplayground`
5. Save the **Client ID** and **Client Secret**

### 2.3 Get Refresh Token (Using Cloud Shell)
```bash
# Install required tools (if needed)
pip3 install --user google-auth google-auth-oauthlib

# Create a simple Python script to get the refresh token
cat > get_refresh_token.py << 'EOF'
#!/usr/bin/env python3
import json
from google_auth_oauthlib.flow import Flow

# Your OAuth credentials
CLIENT_ID = input("Enter your Client ID: ")
CLIENT_SECRET = input("Enter your Client Secret: ")

# OAuth flow configuration
flow = Flow.from_client_config(
    {
        "web": {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["https://developers.google.com/oauthplayground"]
        }
    },
    scopes=["https://www.googleapis.com/auth/chromewebstore"],
    redirect_uri="https://developers.google.com/oauthplayground"
)

# Get authorization URL
auth_url, _ = flow.authorization_url(prompt='consent')
print(f"\n🔗 Open this URL in your browser:")
print(f"{auth_url}\n")

# Get authorization code from user
auth_code = input("Enter the authorization code from the redirect URL: ")

# Exchange code for tokens
flow.fetch_token(code=auth_code)
credentials = flow.credentials

print(f"\n✅ Success! Your credentials:")
print(f"Client ID: {CLIENT_ID}")
print(f"Client Secret: {CLIENT_SECRET}")
print(f"Refresh Token: {credentials.refresh_token}")
print(f"\n💾 Save these as GitHub Secrets!")
EOF

# Run the script
python3 get_refresh_token.py
```

### 2.4 Get Your Extension ID
```bash
# If you have your extension URL, extract the ID
echo "Extension ID is the 32-character string in your Chrome Web Store URL"
echo "Example: https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID"
```

## Step 3: Test Your Setup (In Cloud Shell)

### 3.1 Clone Your Repository
```bash
git clone https://github.com/YOUR_USERNAME/Omnisearch.git
cd Omnisearch
```

### 3.2 Test Packaging
```bash
# Test the packaging script
python3 scripts/package.py
```

### 3.3 Test API Connection
```bash
# Create a test script to verify your credentials
cat > test_api.py << 'EOF'
#!/usr/bin/env python3
import requests
import json

# Your credentials
CLIENT_ID = input("Client ID: ")
CLIENT_SECRET = input("Client Secret: ")
REFRESH_TOKEN = input("Refresh Token: ")
EXTENSION_ID = input("Extension ID: ")

# Get access token
token_response = requests.post("https://oauth2.googleapis.com/token", data={
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "refresh_token": REFRESH_TOKEN,
    "grant_type": "refresh_token"
})

if token_response.status_code == 200:
    access_token = token_response.json()["access_token"]
    print("✅ Access token obtained successfully!")
    
    # Test API call
    headers = {"Authorization": f"Bearer {access_token}"}
    api_response = requests.get(
        f"https://www.googleapis.com/chromewebstore/v1.1/items/{EXTENSION_ID}?projection=DRAFT",
        headers=headers
    )
    
    if api_response.status_code == 200:
        print("✅ API connection successful!")
        print("🎉 Your credentials are working!")
    else:
        print(f"❌ API call failed: {api_response.status_code}")
        print(api_response.text)
else:
    print(f"❌ Token refresh failed: {token_response.status_code}")
    print(token_response.text)
EOF

python3 test_api.py
```

## Step 4: Set GitHub Secrets

Once you have all credentials working, add them to your GitHub repository:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `CHROME_CLIENT_ID`
   - `CHROME_CLIENT_SECRET` 
   - `CHROME_REFRESH_TOKEN`
   - `CHROME_EXTENSION_ID`

## Step 5: Deploy from Cloud Shell

```bash
# Update version in manifest.json
nano manifest.json

# Commit and tag
git add .
git commit -m "Update version to 1.2.5"
git tag v1.2.5
git push origin master --tags

# GitHub Actions will automatically package and publish!
```

## Benefits of Cloud Shell Approach

🚀 **No Local Setup**: Everything runs in the browser  
🔒 **Secure**: Credentials handled in Google's environment  
⚡ **Fast**: Pre-configured environment with all tools  
🌍 **Accessible**: Works from any device with a browser  
💰 **Free**: No additional costs  

## Troubleshooting

### Common Issues:
- **"API not enabled"**: Run `gcloud services enable chromewebstore.googleapis.com`
- **"Invalid credentials"**: Double-check Client ID/Secret from console
- **"Invalid grant"**: Refresh token may have expired, regenerate it
- **"Extension not found"**: Verify your Extension ID is correct

### Tips:
- Keep Cloud Shell active to avoid timeouts
- Use `tmux` for long-running operations
- Store credentials in Cloud Shell's persistent home directory
- Use `gcloud auth list` to check your authenticated accounts 