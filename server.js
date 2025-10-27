require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const { handleOAuthCallback, checkAuthorization } = require('./src/auth/oauthHandler');
const { initDatabase } = require('./src/db/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDatabase().catch(err => {
  console.error('Database initialization error:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://miro.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.miro.com"],
            frameSrc: ["'self'", "https://miro.com"],
            frameAncestors: ["'self'", "https://miro.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"]
        }
    }
}));

// Session configuration
app.use(session({
    secret: process.env.MIRO_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.static('.'));

// Enable CORS for Miro
app.use(cors({
  origin: 'https://miro.com',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OAuth callback route
app.get('/auth', handleOAuthCallback);

// Authorization check endpoint
app.get('/api/check-auth/:userId', async (req, res) => {
  const isAuthorized = await checkAuthorization(req.params.userId);
  res.json({ authorized: isAuthorized });
});

// Panel route
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'app.html'));
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
