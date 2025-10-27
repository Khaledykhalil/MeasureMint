require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const helmet = require('helmet');
const tokenService = require('./src/utils/tokenService');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ID = process.env.MIRO_CLIENT_ID;
const CLIENT_SECRET = process.env.MIRO_CLIENT_SECRET;
const REDIRECT_URL = process.env.MIRO_REDIRECT_URL;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://miro.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.miro.com"],
            frameSrc: ["'self'", "https://miro.com"],
            frameAncestors: ["'self'", "https://miro.com"]
        }
    }
}));

// Session configuration
app.use(session({
    secret: CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Enable CORS for Miro
app.use(cors({
  origin: 'https://miro.com',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Serve the main HTML file with dynamically injected client ID
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), {
    headers: {
      'X-Miro-Client-Id': CLIENT_ID
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OAuth redirect endpoint
app.get('/auth', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  
  if (error) {
    return res.sendFile(path.join(__dirname, 'public', 'error.html'));
  }

  if (!code) {
    return res.sendFile(path.join(__dirname, 'public', 'error.html'));
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://api.miro.com/v1/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URL
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Get user info to use as userId
    const userInfo = await axios.get('https://api.miro.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenResponse.data.access_token}`
      }
    });

    // Store the token securely
    await tokenService.storeToken(userInfo.data.id, tokenResponse.data);
    
    // Store user info in session
    req.session.userId = userInfo.data.id;
    req.session.userName = userInfo.data.name;
    
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`🚀 MeasureMint server running at http://localhost:${PORT}`);
  console.log(`📱 App URL: http://localhost:${PORT}`);
  console.log(`🔒 OAuth Redirect URL: http://localhost:${PORT}/auth`);
});
