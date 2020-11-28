const coap = require('coap');
const Util = require('../../common');

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
        const ciphertext = Util.encryptRSA(payload, serverPublicKey);
        const packet = Buffer.concat([Buffer.from(signature), ciphertext]);

        req.write(packet);
        
        // Wait for a response
        req.on('response', function(res) {
            // Slice response into signature and data
            const resSignature = res.payload.subarray(0, 512).toString('utf-8');
            const encrypted = res.payload.subarray(512, res.payload.length).toString('hex');

            // Decrypt
            const plain = Util.decryptRSA(encrypted, privateKey);
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