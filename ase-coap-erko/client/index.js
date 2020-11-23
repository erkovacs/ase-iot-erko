const coap = require('coap');

setInterval(() => {

    // Send some dummy data
    const temp = Math.floor(Math.random() * (21.5 - 19.5) + 19.5);
    const req = coap.request(`coap://[::1]/api/temp/${temp}`);
    req.on('response', function(res) {
        res.pipe(process.stdout)
        res.on('end', function() {
        })
    });
    req.end();

}, 3000);
