# 🔧 Troubleshooting: Can't Find App in Miro

## Current Status Check ✅

Your development environment is running:
- ✅ Next.js server on port 3000
- ✅ Ngrok tunnel active: `https://postmenstrual-disinfective-meri.ngrok-free.dev`
- ✅ app-manifest.yaml configured with correct ngrok URL

## Common Issues & Solutions

### 1. **App Not Installed in Miro** (Most Common)

**Symptoms:** App doesn't appear in the Miro board apps panel

**Solution:**
1. Go to https://miro.com/app/settings/user-profile/apps
2. Find your "MeasureMint" app in your app list
3. Click on the app name
4. In the app settings, verify these URLs match:
   - **App URL**: `https://postmenstrual-disinfective-meri.ngrok-free.dev/panel`
   - **Redirect URI**: `https://postmenstrual-disinfective-meri.ngrok-free.dev/api/redirect`
5. Click "Install app and get OAuth token"
6. Open a Miro board
7. Click the **Apps** icon (puzzle piece) in the left toolbar
8. Search for "MeasureMint"
9. Click to install/enable it

---

### 2. **Ngrok URL Changed**

**Symptoms:** App worked before but stopped working

**Solution:**
When ngrok restarts, it generates a new URL. You need to:

1. **Get your current ngrok URL:**
   ```bash
   curl -s http://localhost:4040/api/tunnels | python3 -m json.tool
   ```
   Or visit: http://localhost:4040

2. **Update Miro app settings:**
   - Go to https://miro.com/app/settings/user-profile/apps
   - Click your MeasureMint app
   - Update **App URL** to: `https://your-new-ngrok-url.ngrok-free.dev/panel`
   - Update **Redirect URI** to: `https://your-new-ngrok-url.ngrok-free.dev/api/redirect`
   - Click **Save**

3. **Update app-manifest.yaml:**
   ```bash
   npm run update-manifest -- --url https://your-new-ngrok-url.ngrok-free.dev
   ```

4. **Reinstall the app:**
   - In Miro app settings, click "Install app and get OAuth token"

---

### 3. **App Panel Not Loading**

**Symptoms:** App icon appears but clicking it shows blank/error

**Solution:**

1. **Check if server is running:**
   ```bash
   lsof -i :3000
   ```
   If nothing appears, start the server:
   ```bash
   npm run dev
   ```

2. **Check browser console:**
   - Open your browser's developer tools (F12)
   - Look for errors related to CORS or network
   - Check if requests to ngrok URL are being blocked

3. **Try ngrok dashboard:**
   - Visit http://localhost:4040
   - Make a test request to your app URL
   - Check if requests are reaching your server

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or clear Miro-specific cache

---

### 4. **OAuth/Authentication Errors**

**Symptoms:** "Authentication required" or OAuth errors

**Solution:**

1. **Verify redirect URI:**
   - Must match exactly in both Miro settings and app-manifest.yaml
   - Must include the full path: `/api/redirect`

2. **Check scopes:**
   - In Miro app settings, ensure these are enabled:
     - `boards:read`
     - `boards:write`

3. **Reinstall the app:**
   - Uninstall from board
   - Reinstall from Miro app settings

---

### 5. **Ngrok Free Tier Warning Page**

**Symptoms:** "You are about to visit" warning page appears

**Solution:**

Ngrok free tier shows a warning page. Options:

1. **Click "Visit Site"** on the warning page (users must do this once per session)

2. **Upgrade to Ngrok paid plan** ($8/month) to remove the warning

3. **Use production deployment:**
   - Deploy to https://measuremint.app
   - Update app-manifest.yaml to use production URL
   - No ngrok needed

---

## Quick Fixes Checklist

- [ ] Server is running on port 3000
- [ ] Ngrok is running and accessible at http://localhost:4040
- [ ] Ngrok URL in app-manifest.yaml matches current ngrok URL
- [ ] Miro app settings have correct URLs (App URL and Redirect URI)
- [ ] App is installed in your Miro account
- [ ] App is enabled in the specific board you're testing
- [ ] Browser cache cleared
- [ ] No console errors in browser developer tools

---

## Step-by-Step: Fresh Install

If nothing else works, start fresh:

### Step 1: Start Local Server
```bash
npm run dev
```
Leave this running in one terminal.

### Step 2: Start Ngrok
In a new terminal:
```bash
ngrok http 3000
```
Note the HTTPS URL (e.g., `https://abc123.ngrok-free.dev`)

### Step 3: Update App Manifest
```bash
npm run update-manifest -- --url https://YOUR-NGROK-URL.ngrok-free.dev
```

### Step 4: Configure Miro App
1. Go to https://miro.com/app/settings/user-profile/apps
2. Click your app or create new one
3. Set these values:
   - **App Name**: MeasureMint
   - **App URL**: `https://YOUR-NGROK-URL.ngrok-free.dev/panel`
   - **Redirect URI for OAuth2.0**: `https://YOUR-NGROK-URL.ngrok-free.dev/api/redirect`
   - **Permissions**: Enable `boards:read` and `boards:write`
4. Click **Save**
5. Click **Install app and get OAuth token**

### Step 5: Install in Board
1. Open any Miro board
2. Click **Apps** icon (left sidebar)
3. Search "MeasureMint"
4. Click to install
5. App panel should open on the right

---

## Testing Your Setup

### Test 1: Server Health
Visit: http://localhost:3000/panel
**Expected:** Panel page loads (may show "Miro API not available" - that's OK)

### Test 2: Ngrok Tunnel
Visit: https://YOUR-NGROK-URL.ngrok-free.dev/panel
**Expected:** Same page loads (may show ngrok warning first)

### Test 3: API Endpoint
Visit: http://localhost:3000/api/redirect
**Expected:** Redirect handler response or error

### Test 4: Manifest
Check your app-manifest.yaml has correct URLs:
```bash
cat app-manifest.yaml | grep sdkUri
cat app-manifest.yaml | grep redirectUris
```

---

## Getting Help

If you're still stuck:

1. **Check ngrok dashboard**: http://localhost:4040
   - See all incoming requests
   - Check for errors or blocked requests

2. **Check browser console**:
   - F12 → Console tab
   - Look for red errors

3. **Check server logs**:
   - Look at the terminal where `npm run dev` is running
   - Check for errors or warnings

4. **Verify URLs match exactly**:
   - app-manifest.yaml
   - Miro app settings
   - No trailing slashes
   - HTTPS for ngrok URLs

---

## Production Deployment

To avoid ngrok issues entirely, deploy to production:

1. Deploy to Vercel/Netlify/your hosting
2. Update app-manifest.yaml to use production URLs
3. Update Miro app settings with production URLs
4. No more ngrok needed!

See [DEPLOYMENT.md](DEPLOYMENT.md) for full production deployment guide.
