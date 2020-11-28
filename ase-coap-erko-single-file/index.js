const coap = require('coap');
const crypto = require('crypto');

class Util {

    static hash (string) {
        const hash = crypto
            .createHash('sha256')
            .update(string)
            .digest('hex');
        return hash;
    }

    static encrypt (text, key) {
        const encryptedData = crypto.publicEncrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(text));
        return encryptedData;
    }

    static decrypt (data, key) {
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

function doClient () {
    // Create own keys
    const { publicKey, privateKey } = Util.generateKeys();
    let req, serverPublicKey;

    // Send own pub and await server's pub
    req = coap.request({ 
        observe: false,
        host: 'localhost',
        pathname: '/api/set-pub', 
        method: 'post' 
    });
    req.write(publicKey);
    req.end();
    req.on('response', function(res) {
        // We get server's pub
        serverPublicKey = res.payload.toString('utf-8');

        // We have exchanged keys and can start sending messages
        setInterval(() => {

            // Send some dummy temperature data
            req = coap.request({ 
                observe: false,
                host: 'localhost',
                pathname: '/api/temp', 
                method: 'post' 
            });
            
            const temp = (Math.random() * (21.5 - 19.5) + 19.5).toFixed(3);
        
            // Serialize, sign and encrypt data
            const payload = JSON.stringify({ temp });
            const signature = Util.sign(privateKey, payload);
            const ciphertext = Util.encrypt(payload, serverPublicKey);
            const packet = Buffer.concat([Buffer.from(signature), ciphertext]);

            req.write(packet);
            
            // Wait for a response
            req.on('response', function(res) {
                // Slice response into signature and data
                const resSignature = res.payload.subarray(0, 512).toString('utf-8');
                const encrypted = res.payload.subarray(512, res.payload.length).toString('hex');

                // Decrypt
                const plain = Util.decrypt(encrypted, privateKey);
                const data = JSON.parse(plain);
                
                // Verify
                if (!Util.verify(serverPublicKey, resSignature, plain)) {
                    console.log('Invalid signature, either data was tampered with or another client private key was used!');
                }
                // Log data to console
                else if (data.success) {
                    console.log('Successfully pinged server, response = ', data);
                } else {
                    console.log('Error occurred = ', data);
                }
            });
            req.end();
        }, 3000);
    });

    // Exit gracefully on ctrl-c
    process.on('SIGINT', (code) => {
        console.log('Exiting...');
        if (req && req._writableState.writing) {
            console.log(req);
        }
        process.exit();
    });
}

function doServer () {

    // Create own keys
    const { publicKey, privateKey } = Util.generateKeys();
    let clientPublicKey;

    const server = coap.createServer({ type: 'udp4' });

    server.on('request', function(req, res) {
    // We exchnage keys
    if ('/api/set-pub' === req.url) {
        clientPublicKey = req.payload.toString('utf-8');
        res.end(publicKey);
    } 
    // We get requests
    else {
        let success = true;

        // Slice the signature from the payload
        let payload = req.payload;
        let decrypted, data;
        
        try {
        // We know signature is in hex and its string length is 512 (2*256)
        const signature = payload.subarray(0, 512).toString('utf-8');
        
        // The rest is payload
        const encrypted = payload.subarray(512, payload.length).toString('hex');
        decrypted = Util.decrypt(encrypted, privateKey).toString('utf-8');

        // Verify or log error
        if (Util.verify(clientPublicKey, signature, decrypted)) {
            data = JSON.parse(decrypted)
        } else {
            success = false;
            data = { error: 'Invalid signature, either data was tampered with or another client private key was used!' };
        }
        } catch (error) {
        success = false;
        data = error;
        }
        console.log('Temp=', data && data.temp ? data.temp : '?');
    
        // Respond with encrypted data
        let response = JSON.stringify({ success, data });
        let signature = Util.sign(privateKey, response);
        let encryptedResponse = Util.encrypt(response, clientPublicKey);
        let packet = Buffer.concat([Buffer.from(signature), encryptedResponse]);
        res.end(packet);
    }
    });

    // the default CoAP port is 5683
    server.listen(function() {
    console.log('Server running');
    });

    // Exit gracefully on ctrl-c
    process.on('SIGINT', (code) => {
    console.log('Exiting...');
    server.close();
    process.exit();
    });
}

doServer();
doClient();