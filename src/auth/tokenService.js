const crypto = require('crypto');
const { getTokenFromDatabase, saveTokenToDatabase } = require('../db/database');

// Token encryption/decryption
const encryptToken = (token, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex')
  };
};

const decryptToken = (encrypted, key) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key),
    Buffer.from(encrypted.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Token service
const storeToken = async (token, userId) => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptedToken = encryptToken(token, encryptionKey);
  await saveTokenToDatabase(userId, encryptedToken);
  return true;
};

const retrieveToken = async (userId) => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptedToken = await getTokenFromDatabase(userId);
  if (!encryptedToken) return null;
  return decryptToken(encryptedToken, encryptionKey);
};

module.exports = {
  storeToken,
  retrieveToken,
  encryptToken,
  decryptToken
};