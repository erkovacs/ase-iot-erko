const mqtt = require('mqtt');
const Util = require('../../common');

const KEY = process.env.KEY && process.env.KEY.length >= 16 ? process.env.KEY : null;

if (!KEY) {
    console.log("Fatal: Key not specified or of insufficient length");
    process.exit();
}

const BROKER = 'mqtt://test.mosquitto.org';

const options = {
  // Send traffic over unencrypted port
  port: 1883,
};

const client = mqtt.connect(BROKER, options);

client.on('connect', () => {
  
  client.subscribe('erko-temp', err => {
    if (err) { 
      console.log(err);
      return;
    }

    // Ping the server with some dummy data every 3 seconds
    setInterval(() => {
      const temp = (Math.random() * (21.5 - 19.5) + 19.5).toFixed(3);
      const payload = JSON.stringify({ temp });
      const encrypted = Util.encrypt(payload, KEY);
      client.publish('erko-temp', encrypted);
    }, 3000);
  });

  console.log(`Connected to broker ${BROKER}:${options.port}`);
});
 
client.on('message', (topic, message) => {
  // Decrypt, parse and log the temperature
  const decrypted = Util.decrypt(message.toString(), KEY);
  const payload = (() => { try { return JSON.parse(decrypted); } catch (e) { return null; }})();
  console.log('Temp=', payload ? payload.temp : '?');
});

// Exit gracefully on ctrl-c
process.on('SIGINT', (code) => {
  console.log('Exiting...');
  client.end();
  process.exit();
});