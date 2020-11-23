const coap = require('coap');
const server = coap.createServer({ type: 'udp6' });
 
server.on('request', function(req, res) {
  const temp = req.url.split('/')[3];
  console.log('Temp=' + temp);
  res.end(JSON.stringify({ success: true }));
});

// the default CoAP port is 5683
server.listen(function() {
  console.log('Server running');
});