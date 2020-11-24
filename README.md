# ASE IOT Projects

## For ASE-MQTT-ERKO
TODO:: Not yet done

## For ASE-COAP-ERKO
MQTT client can be run using the following steps:
 - Create tour key and cert in the `./ase-mqtt-erko` directory: `openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout client-key.pem -out client-cert.pem`
 - Download Mosquitto ceritificate from `https://test.mosquitto.org/` and save to the same directory
 - Or, just use the ones provided in the repo
 - Run `npm run client`