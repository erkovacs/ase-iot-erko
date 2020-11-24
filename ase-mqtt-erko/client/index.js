const mqtt = require('mqtt');
const fs = require('fs');

const options = {
  // Port according to spec on mosquitto website
  port: 8884,

  // Necessary only if the server requires client certificate authentication
  key: fs.readFileSync('./client-key.pem'),
  cert: fs.readFileSync('./client-cert.pem'),

  // Necessary only if the server uses a self-signed certificate
  ca: [ fs.readFileSync('./mosquitto.org.crt') ],

  // Necessary only if the server's cert isn't for "localhost"
  checkServerIdentity: () => { return null; }
};

const client  = mqtt.connect('mqtts://test.mosquitto.org', options);

client.on('connect', () => {
  
  client.subscribe('temp', err => {
    if (err) { 
      console.log(err);
      return;
    }

    const temp = Math.floor(Math.random() * (21.5 - 19.5) + 19.5);
    client.publish('temp', temp.toString());
  });
});
 
client.on('message', (topic, message) => {
  // message is Buffer
  console.log('Response', message.toString());
  client.end();
});