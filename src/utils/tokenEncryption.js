const CryptoJS = require('crypto-js');
const crypto = require('crypto');

class TokenEncryption {
    constructor() {
        // Generate a secure encryption key based on the client secret
        // This ensures that tokens can only be decrypted with the correct client secret
        this.encryptionKey = CryptoJS.SHA256(process.env.MIRO_CLIENT_SECRET).toString();
    }

    encrypt(text) {
        // Generate a random IV for each encryption
        const iv = crypto.randomBytes(16);
        const encrypted = CryptoJS.AES.encrypt(text, this.encryptionKey, {
            iv: CryptoJS.lib.WordArray.create(iv)
        });
        
        return {
            encrypted: encrypted.toString(),
            iv: iv.toString('hex')
        };
    }

    decrypt(encryptedText, iv) {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey, {
            iv: CryptoJS.lib.WordArray.create(Buffer.from(iv, 'hex'))
        });
        
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    // Utility method to encrypt an entire token object
    encryptToken(token) {
        const { encrypted, iv } = this.encrypt(JSON.stringify(token));
        return { encrypted, iv };
    }

    // Utility method to decrypt a token object
    decryptToken(encrypted, iv) {
        const decrypted = this.decrypt(encrypted, iv);
        return JSON.parse(decrypted);
    }
}

module.exports = new TokenEncryption();