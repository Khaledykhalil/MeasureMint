const { storeToken, retrieveToken } = require('./tokenService');

const handleOAuthCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('/error.html');
    }

    if (!code) {
      console.error('No code received');
      return res.redirect('/error.html');
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://api.miro.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.MIRO_CLIENT_ID,
        client_secret: process.env.MIRO_CLIENT_SECRET,
        redirect_uri: process.env.MIRO_REDIRECT_URL
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return res.redirect('/error.html');
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token securely
    await storeToken(tokenData.access_token, state);

    res.redirect('/success.html');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/error.html');
  }
};

const checkAuthorization = async (userId) => {
  try {
    const token = await retrieveToken(userId);
    if (!token) return false;

    // Verify token validity
    const response = await fetch('https://api.miro.com/v1/oauth-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Authorization check failed:', error);
    return false;
  }
};

module.exports = {
  handleOAuthCallback,
  checkAuthorization
};