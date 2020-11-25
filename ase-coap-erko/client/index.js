const coap = require('coap');

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

    req.write(JSON.stringify({ temp }));

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