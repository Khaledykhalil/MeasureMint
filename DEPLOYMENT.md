# MeasureMint Deployment Guide

## Production Domain
**https://measuremint.app/**

## Pre-Deployment Checklist

### 1. Environment Variables

Update `.env` file or your hosting platform's environment variables:

```bash
# Miro App credentials
MIRO_CLIENT_ID=3458764645376747153
MIRO_CLIENT_SECRET=NX3FsUJmCBSSXbOCbPVYeP2aJR2hAI18
MIRO_REDIRECT_URL=https://measuremint.app/api/redirect

# Server configuration
PORT=3000
NODE_ENV=production

# Security
ENCRYPTION_KEY=85123e89b05c2798905ede2dfde94ae7

# Database configuration
DB_PATH=db/tokens.db
```

### 2. Update App Manifest

Edit `app-manifest.yaml`:

```yaml
appName: MeasureMint
sdkVersion: SDK_V2
sdkUri: https://measuremint.app/panel
boardPicker:
  allowedDomains: []
redirectUris:
  - https://measuremint.app/api/redirect
redirectUriForSdk: ''
scopes:
  - boards:read
  - boards:write
```

### 3. Update Miro Developer Console

1. Go to [Miro Developer Console](https://miro.com/app/settings/user-profile/apps)
2. Select your MeasureMint app
3. Update the following:
   - **App URL**: `https://measuremint.app`
   - **Redirect URI**: `https://measuremint.app/api/redirect`
   - **SDK URI**: `https://measuremint.app/panel`
   - **Privacy Policy URL**: `https://measuremint.app/privacy-policy`
   - **Terms of Service URL**: `https://measuremint.app/terms-of-service`

### 4. SSL/HTTPS Setup

Ensure your hosting platform has HTTPS enabled. Miro requires all apps to use HTTPS.

Common hosting platforms:
- **Vercel**: Auto HTTPS ✅
- **Netlify**: Auto HTTPS ✅
- **Heroku**: SSL add-on required
- **AWS**: Configure ALB/CloudFront
- **DigitalOcean**: Configure Let's Encrypt

### 5. Database Setup

Ensure the SQLite database directory exists and has proper permissions:

```bash
mkdir -p db
chmod 755 db
```

### 6. Build and Start

```bash
# Install dependencies
npm install

# Build Next.js app (if using Next.js)
npm run build

# Start production server
npm start
```

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard

### Option 2: DigitalOcean App Platform

1. Connect GitHub repository
2. Set build command: `npm install && npm run build`
3. Set run command: `npm start`
4. Add environment variables
5. Configure custom domain: `measuremint.app`

### Option 3: AWS Elastic Beanstalk

1. Install EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create production`
4. Deploy: `eb deploy`
5. Configure environment variables
6. Set up Route 53 for `measuremint.app`

### Option 4: Docker + Any Platform

```bash
# Build Docker image
docker build -t measuremint:latest .

# Run container
docker run -d -p 3000:3000 --env-file .env measuremint:latest
```

## Post-Deployment Verification

### 1. Test URLs

- ✅ Main app: `https://measuremint.app`
- ✅ Privacy policy: `https://measuremint.app/privacy-policy`
- ✅ Terms of service: `https://measuremint.app/terms-of-service`
- ✅ Health check: `https://measuremint.app/health`
- ✅ OAuth callback: `https://measuremint.app/auth`
- ✅ Panel: `https://measuremint.app/panel`

### 2. Test OAuth Flow

1. Open Miro board
2. Add MeasureMint app from marketplace
3. Verify OAuth redirect works
4. Test measurement functionality

### 3. Monitor Logs

Check for any errors in production logs:

```bash
# If using PM2
pm2 logs measuremint

# If using Docker
docker logs <container-id>

# If using Vercel
vercel logs
```

## DNS Configuration

Configure your DNS provider (GoDaddy, Cloudflare, etc.):

### A Record (if using IP)
```
Type: A
Name: @
Value: <your-server-ip>
TTL: 3600
```

### CNAME Record (if using alias)
```
Type: CNAME
Name: www
Value: measuremint.app
TTL: 3600
```

### For Vercel/Netlify
Follow their custom domain setup guide - usually automatic!

## Rollback Plan

If issues occur after deployment:

1. **Revert to ngrok temporarily**:
   - Update `MIRO_REDIRECT_URL` back to ngrok URL
   - Update Miro Developer Console settings
   - Update `app-manifest.yaml`

2. **Check logs** for specific errors

3. **Verify environment variables** are set correctly

4. **Test locally** with production config:
   ```bash
   NODE_ENV=production npm start
   ```

## Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables not committed to git
- ✅ `.env` file in `.gitignore`
- ✅ OAuth tokens encrypted
- ✅ Database secured
- ✅ CORS configured for Miro domains only
- ✅ Content Security Policy headers set
- ✅ Rate limiting configured (if needed)

## Monitoring

Set up monitoring for production:

1. **Uptime monitoring**: UptimeRobot, Pingdom
2. **Error tracking**: Sentry, Rollbar
3. **Analytics**: Google Analytics, Mixpanel
4. **Logs**: Papertrail, Loggly

## Support URLs

After deployment, these URLs will be live:

- **App**: https://measuremint.app
- **Privacy**: https://measuremint.app/privacy-policy
- **Terms**: https://measuremint.app/terms-of-service
- **GitHub**: https://github.com/Khaledykhalil/MeasureMint
- **Issues**: https://github.com/Khaledykhalil/MeasureMint/issues

## Miro Marketplace Submission

After successful deployment:

1. Go to [Miro Developer Console](https://miro.com/app/settings/user-profile/apps)
2. Click "Submit for Review"
3. Provide:
   - App description
   - Screenshots (3-5 images)
   - Demo video (optional but recommended)
   - Privacy policy URL: `https://measuremint.app/privacy-policy`
   - Terms of service URL: `https://measuremint.app/terms-of-service`
   - Support email: khaledykhalil09@gmail.com
   - Category: Productivity / Utilities

4. Wait for Miro team review (typically 1-2 weeks)

## Congratulations! 🎉

Your MeasureMint app is now live at **https://measuremint.app**!
