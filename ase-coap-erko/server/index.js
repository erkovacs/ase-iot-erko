const coap = require('coap');
const Util = require('../../common');

// Read key
const KEY = process.env.KEY && process.env.KEY.length >= 16 ? process.env.KEY : null;

if (!KEY) {
    console.log("Fatal: Key not specified or of insufficient length");
    process.exit();
}

const server = coap.createServer({ type: 'udp4' });

server.on('request', function(req, res) {
  // Decrypt and parse what we got
  let payload = req.payload.toString('utf-8');
  let decrypted = Util.decrypt(payload, KEY);
  const data = (() => { try { return JSON.parse(decrypted); } catch (e) { return null; }})();
  console.log('Temp=', data ? data.temp : '?');

  // Respond with encrypted data
  let response = JSON.stringify({ success: true, updated: { temp: data.temp } });
  let encryptedResponse = Util.encrypt(response, KEY);
  res.end(encryptedResponse);
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