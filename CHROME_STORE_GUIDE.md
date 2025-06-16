# Chrome Web Store Publishing Guide

## Prerequisites
1. **Google Account** - You'll need a Google account
2. **Developer Fee** - One-time $5 registration fee
3. **Extension Ready** - Your extension should be fully tested

## Step 1: Register as Chrome Web Store Developer
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the $5 one-time developer registration fee
4. Accept the developer agreement

## Step 2: Prepare Your Extension Package
1. **Create a ZIP file** containing all extension files:
   ```
   omnisearch-extension.zip
   ├── manifest.json
   ├── popup.html
   ├── popup.js
   ├── settings.html
   ├── settings.js
   ├── icon-16.png
   ├── icon-32.png
   ├── icon-48.png
   ├── icon-128.png
   ├── icon.png
   └── icon.svg
   ```

2. **Exclude development files** (already handled by .gitignore):
   - No .git folder
   - No README.md
   - No LICENSE (optional to include)
   - No development scripts

## Step 3: Create Store Listing Assets

### Required Images
1. **Icon** (already have): 128x128px PNG
2. **Screenshots** (need to create): 1280x800px or 640x400px
   - Show the extension popup in action
   - Show the settings page
   - Demonstrate search functionality
3. **Promotional Images** (optional but recommended):
   - Small tile: 440x280px
   - Large tile: 920x680px
   - Marquee: 1400x560px

### Store Listing Content
- **Name**: "Omnisearch" (or "Omnisearch Extension")
- **Summary**: "Search multiple platforms at once with a single query"
- **Description**: Use the README content, formatted for the store
- **Category**: "Productivity"
- **Language**: English

## Step 4: Upload and Configure

1. **Go to Developer Dashboard**
2. **Click "New Item"**
3. **Upload your ZIP file**
4. **Fill out the store listing**:
   - Name: Omnisearch
   - Summary: Search multiple platforms at once with a single query
   - Description: (detailed description)
   - Category: Productivity
   - Language: English

5. **Upload images**:
   - Icon (128x128)
   - Screenshots
   - Promotional images

6. **Set pricing**: Free

7. **Select regions**: Worldwide (or specific regions)

## Step 5: Privacy and Permissions

1. **Privacy Policy**: 
   - Since you use storage permission, you may need a privacy policy
   - Simple statement about local storage usage
   - Can host on GitHub Pages or your website

2. **Permissions Justification**:
   - `tabs`: "To open search results in new tabs"
   - `storage`: "To save user's search engine preferences"

## Step 6: Review and Publish

1. **Review all information**
2. **Click "Submit for Review"**
3. **Wait for Google's review** (usually 1-7 days)
4. **Address any feedback** if rejected
5. **Extension goes live** once approved

## Step 7: Post-Publication

1. **Monitor reviews** and respond to user feedback
2. **Update regularly** with new features/bug fixes
3. **Track analytics** in the developer dashboard

## Tips for Approval

1. **Clear description** of what the extension does
2. **Proper permissions** - only request what you need
3. **Good screenshots** showing functionality
4. **Test thoroughly** before submission
5. **Follow Google's policies** strictly

## Common Rejection Reasons

1. **Misleading description**
2. **Excessive permissions**
3. **Poor quality screenshots**
4. **Broken functionality**
5. **Policy violations**

## Useful Links

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)
- [Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)

## Cost Summary
- **Developer Registration**: $5 (one-time)
- **Publishing**: Free
- **Updates**: Free
- **Hosting**: Free (Google hosts it)

## Timeline
- **Registration**: Immediate after payment
- **Upload & Configure**: 30-60 minutes
- **Review Process**: 1-7 days
- **Go Live**: Immediate after approval 