const coap = require('coap');
const Util = require('../../common');

const KEY = process.env.KEY && process.env.KEY.length >= 16 ? process.env.KEY : null;

if (!KEY) {
    console.log("Fatal: Key not specified or of insufficient length");
    process.exit();
}

let req;

setInterval(() => {

    // Send some dummy data
    req = coap.request({ 
        observe: false,
        host: 'localhost',
        pathname: '/api/temp', 
        method: 'post' 
    });
    
    const temp = (Math.random() * (21.5 - 19.5) + 19.5).toFixed(3);

    // Serialize and encrypt data
    const payload = JSON.stringify({ temp });
    const ciphertext = Util.encrypt(payload, KEY, KEY);
    req.write(ciphertext);

    req.on('response', function(res) {
        // Decrypt response
        const payload = Util.decrypt(res.payload.toString('utf-8'), KEY);
        const data = JSON.parse(payload);
        if (data.success) {
            console.log('Successfully pinged server, response = ', data);
        }
        res.on('end', function() {
            // on request end
        })
    });

    req.end();
}, 3000);

// Exit gracefully on ctrl-c
process.on('SIGINT', (code) => {
    console.log('Exiting...');
    if (req && req._writableState.writing) {
        console.log(req);
    }
    process.exit();
});