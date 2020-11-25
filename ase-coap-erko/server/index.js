const coap = require('coap');
const server = coap.createServer({ type: 'udp4' });
 
server.on('request', function(req, res) {
  const payload = (() => { try { return JSON.parse(req.payload.toString('utf-8')); } catch (e) { return null; }})();
  console.log('Temp=', payload ? payload.temp : '?');
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