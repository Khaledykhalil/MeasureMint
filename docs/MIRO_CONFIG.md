# Miro App Configuration

To set up your Miro app:

1. Visit https://miro.com/app/settings/user-profile/apps
2. Create new app or select existing app
3. Copy your Client ID from the app settings
4. Replace the placeholder in index.html with your Client ID
5. Set up these URLs in your app settings:
   - Web Plugin URL: http://localhost:3001
   - App URL: http://localhost:3001
   - Redirect URI: http://localhost:3001/auth
6. Enable these permissions:
   - boards:read
   - boards:write
   - boards:write:image

Your Client ID should be added to the meta tag in index.html:
```html
<meta name="miro-sdk" content="your_client_id_here">
```

DO NOT commit your Client ID to version control. Instead, create a local copy of this file
named config.local.md with your actual Client ID for reference.