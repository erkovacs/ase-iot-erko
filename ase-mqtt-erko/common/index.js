const crypto = require('crypto');

const IV = Buffer.from([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]);

class Util {
    static encrypt (text, key) {
        let cipher = crypto.createCipheriv( 
            'aes-128-cbc', Buffer.from(key, 'utf-8'), IV); 
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    static decrypt (text, key) {
        const cipher = crypto.createDecipheriv(
            'aes-128-cbc', Buffer.from(key, 'utf-8'), IV);
        let decrypted = cipher.update(text, 'hex', 'utf-8');
        decrypted += cipher.final('utf-8');
        return decrypted;
    }
}

module.exports = Util;