const coap = require('coap');
const Util = require('../../common');

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
      decrypted = Util.decryptRSA(encrypted, privateKey).toString('utf-8');

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
    let encryptedResponse = Util.encryptRSA(response, clientPublicKey);
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