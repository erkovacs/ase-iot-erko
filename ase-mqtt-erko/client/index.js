const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://test.mosquitto.org');
 
client.on('connect', () => {
  client.subscribe('temp', err => {
    if (!err) {
      const temp = Math.floor(Math.random() * (21.5 - 19.5) + 19.5);
      client.publish('temp', temp.toString());
    } else {
      console.error(err);
    }
  });
});
 
client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  client.end();
})