const crypto = require('crypto');

const IV = Buffer.from([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]);

class Util {

    static hash (string) {
        const hash = crypto
            .createHash('sha256')
            .update(string)
            .digest('hex');
        return hash;
    }

    static encryptAES (text, key) {
        let cipher = crypto.createCipheriv( 
            'aes-128-cbc', Buffer.from(key, 'utf-8'), IV); 
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    static decryptAES (text, key) {
        const cipher = crypto.createDecipheriv(
            'aes-128-cbc', Buffer.from(key, 'utf-8'), IV);
        let decrypted = cipher.update(text, 'hex', 'utf-8');
        decrypted += cipher.final('utf-8');
        return decrypted;
    }

    static encryptRSA (text, key) {
        const encryptedData = crypto.publicEncrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(text));
        return encryptedData;
    }

    static decryptRSA (data, key) {
        const encryptedData = crypto.privateDecrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(data, 'hex'));
        return encryptedData;
    }
    
    static generateKeys () {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        return {
            publicKey: publicKey.toString('base64'),
            privateKey: privateKey.toString('base64')
        };
    }

    static sign (privateKey, string) {
        const sign = crypto.createSign('SHA256', {
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        });
        sign.write(string);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');  
        return signature;      
    }

    static verify (publicKey, signature, string) {
        const verify = crypto.createVerify('SHA256');
        verify.write(string);
        verify.end();
        return verify.verify(publicKey, signature, 'hex');
    }
}

module.exports = Util;