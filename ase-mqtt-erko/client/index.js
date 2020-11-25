const mqtt = require('mqtt');
const fs = require('fs');

const BROKER = 'mqtt://test.mosquitto.org';

// Specify config options in order to use SSL
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

const client = mqtt.connect(BROKER, options);

client.on('connect', () => {
  
  client.subscribe('erko-temp', err => {
    if (err) { 
      console.log(err);
      return;
    }

    // Ping the server with this every 3 seconds
    setInterval(() => {
      const temp = Math.floor(Math.random() * (21.5 - 19.5) + 19.5);
      const payload = JSON.stringify({ temp });
      client.publish('erko-temp', payload);
    }, 3000);
  });

  console.log(`Connected to broker ${BROKER}:${options.port}`);
});
 
client.on('message', (topic, message) => {
  // Parse and log the temperature
  const payload = (() => { try { return JSON.parse(message.toString()); } catch (e) { return null; }})();
  console.log('Temp=', payload ? payload.temp : '?');
});

// Exit gracefully on ctrl-c
process.on('SIGINT', (code) => {
  console.log('Exiting...');
  client.end();
  process.exit();
});