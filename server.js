require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ID = process.env.MIRO_CLIENT_ID;

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
app.get('/auth', (req, res) => {
  const code = req.query.code;
  console.log('Received authorization code:', code);
  
  // In production, you would exchange this code for an access token
  // For development, we'll just show success
  res.send(`
    <html>
      <body>
        <h1>Authorization Successful!</h1>
        <p>You can close this window and return to Miro.</p>
        <script>
          window.close();
        </script>
      </body>
    </html>
  `);
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
