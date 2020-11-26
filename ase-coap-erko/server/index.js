const coap = require('coap');

const Util = require('../common');

const KEY = process.argv[2] && process.argv[2].length >= 16 ? process.argv[2] : null;

if (!KEY) {
    console.log("Fatal: Key not specified or of insufficient length");
    process.exit();
}

const server = coap.createServer({ type: 'udp4' });

server.on('request', function(req, res) {
  let payload = req.payload.toString('utf-8');
  let decrypted = Util.decrypt(payload, KEY);
  const data = (() => { try { return JSON.parse(decrypted); } catch (e) { return null; }})();
  console.log('Temp=', data ? data.temp : '?');
  res.end(JSON.stringify({ success: true }));
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