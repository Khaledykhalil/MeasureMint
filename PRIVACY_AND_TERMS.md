# Privacy Policy and Terms of Service URLs

## Privacy Policy

### Development URL (ngrok)
```
https://postmenstrual-disinfective-meri.ngrok-free.dev/privacy-policy
```

### Production URL (after deployment)
```
https://measuremint.app/privacy-policy
```

### Local Development
```
http://localhost:3000/privacy-policy
```

## Terms of Service

### Development URL (ngrok)
```
https://postmenstrual-disinfective-meri.ngrok-free.dev/terms-of-service
```

### Production URL (after deployment)
```
https://measuremint.app/terms-of-service
```

### Local Development
```
http://localhost:3000/terms-of-service
```

## Important Notes

1. **Privacy Policy File**: `privacy-policy.html` in root directory
2. **Terms of Service File**: `terms-of-service.html` in root directory
3. **Server Routes**: Configured in `server.js`
4. **Last Updated**: October 31, 2025

## For Miro App Submission

When submitting your app to the Miro Marketplace, you'll need to provide:

1. **Privacy Policy URL**: `https://measuremint.app/privacy-policy`

2. **Terms of Service URL**: `https://measuremint.app/terms-of-service`

## Deployment Checklist

Before going to production:

- [ ] Update `MIRO_REDIRECT_URL` in `.env` to production URL
- [ ] Replace ngrok URL with permanent production domain
- [ ] Update privacy policy contact information if needed
- [ ] Ensure HTTPS is enabled (required by Miro)
- [ ] Test all links in privacy policy and terms of service
- [ ] Update Miro app settings with production URLs

## Key Privacy Policy Highlights

✅ **What We Collect**:
- Miro user ID
- Board content you interact with
- Measurement data (calibrations, distances)
- Unit and display preferences

❌ **What We DON'T Collect**:
- Personal information (beyond Miro's data)
- Board content you don't interact with
- Payment information
- Location data
- Your images or blueprints

🔒 **Security**:
- HTTPS encryption
- OAuth 2.0 authentication
- Secure token storage
- Regular security updates

## Contact Information

- **GitHub**: https://github.com/Khaledykhalil/MeasureMint
- **Issues**: https://github.com/Khaledykhalil/MeasureMint/issues
