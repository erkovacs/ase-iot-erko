const coap = require('coap');
const Util = require('../common');

const KEY = process.argv[2] && process.argv[2].length >= 16 ? process.argv[2] : null;

if (!KEY) {
    console.log("Fatal: Key not specified or of insufficient length");
    process.exit();
}

let req;

setInterval(() => {

    // Send some dummy data
    const temp = Math.floor(Math.random() * (21.5 - 19.5) + 19.5);
    req = coap.request({ 
        observe: false,
        host: 'localhost',
        pathname: '/api/temp', 
        method: 'post' 
    });

    const payload = JSON.stringify({ temp });
    const ciphertext = Util.encrypt(payload, KEY, KEY);
    req.write(ciphertext);

    req.on('response', function(res) {
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