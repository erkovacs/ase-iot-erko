# ASE IOT Projects

## For ASE-MQTT-ERKO
TODO:: Not yet done

## For ASE-COAP-ERKO
Dependencies
 - Node v13.9.0
 - OpenSSL
 
MQTT client can be run using the following steps:
 - Clone this repo
 - Install dependecies `npm install`
 - Create your key and cert in the `./ase-mqtt-erko` directory: `openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout client-key.pem -out client-cert.pem`
 - Download Mosquitto ceritificate from `https://test.mosquitto.org/` and save to the same directory
 - Or, just use the default ones provided in the repo
 - Run `npm run client`
