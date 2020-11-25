# ASE IOT Projects

## For ASE-MQTT-ERKO
Dependencies
 - Node v13.9.0
 - OpenSSL

 COAP Client and Server can be run using the following steps:
 - TODO::

## How it works
TODO::

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
 - Use `Ctrl+C` to kill the process (the business logic is very simple - a random temperature is pushed to the subscribers each 3000ms until it is killed)

## How it works
It uses TLS to create a secure channel over TCP to the remote host (the broker). We authenticate ourselves to the server (we use a self-signed cert) and the server to us. 

For simplicity's sake we used the same script file as "both clients" but this is irrelevant - we could repeat the setup process for another client instance and process incoming data the exact same way, and the data would still be encryted. 

Take a look at the data captured in Wireshark, it's encrypted:

![mqtt-encrypted](./media/mqtt-encrypted.png "MQTT Encrypted")