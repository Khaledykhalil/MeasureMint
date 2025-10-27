const db = require('../db/database');
const tokenEncryption = require('./tokenEncryption');
const axios = require('axios');
const moment = require('moment');

class TokenService {
    constructor() {
        this.miroTokenUrl = 'https://api.miro.com/v1/oauth/token';
    }

    async storeToken(userId, tokenData) {
        const now = moment().unix();
        const expiresAt = tokenData.expires_in ? now + tokenData.expires_in : null;
        
        const { encrypted, iv } = tokenEncryption.encryptToken({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token
        });

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO tokens 
                (user_id, access_token, refresh_token, encrypted_iv, expires_at, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, encrypted, tokenData.refresh_token, iv, expiresAt, now, now],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    async getToken(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM tokens WHERE user_id = ?',
                [userId],
                async (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    if (!row) {
                        resolve(null);
                        return;
                    }

                    try {
                        const token = tokenEncryption.decryptToken(row.access_token, row.encrypted_iv);
                        
                        // Check if token needs refresh
                        if (row.expires_at && moment().unix() >= row.expires_at) {
                            const newToken = await this.refreshToken(userId, token.refresh_token);
                            resolve(newToken);
                        } else {
                            resolve(token);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    async refreshToken(userId, refreshToken) {
        try {
            const response = await axios.post(this.miroTokenUrl, null, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: process.env.MIRO_CLIENT_ID,
                    client_secret: process.env.MIRO_CLIENT_SECRET,
                    refresh_token: refreshToken
                }
            });

            await this.storeToken(userId, response.data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to refresh token: ' + error.message);
        }
    }

    async revokeToken(userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM tokens WHERE user_id = ?',
                [userId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
}

module.exports = new TokenService();