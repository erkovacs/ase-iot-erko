# ASE IOT Projects

## For ASE-MQTT-ERKO
Dependencies
 - Node v13.9.0

 COAP Client and Server can be run using the following steps:
 - Clone this repo
 - Enter the COAP Project `cd ase-coap-erko`
 - Install dependecies `npm install`
 - In a terminal provide a runtime key and run server `KEY=testpassword1234 npm run server`
 - In a second terminal provide a runtime key and run client `KEY=testpassword1234 npm run client`
 - Use `Ctrl+C` to kill either process (the business logic is very simple - a random temperature is pushed to the subscribers each 3000ms until it is killed)

## How it works
The connection uses application-level encryption based on AES-128 in CBC mode with a pre-shared key provided as an environment variable and a known (hardcoded) IV. 

There are two files, one for the client and one for the server. They must be run in parallel so they can talk to each other.

Take a look at the data captured in Wireshark, it's encrypted (both the request and the response):

![coap-encrypted](./media/coap-image-1.PNG)
![coap-encrypted](./media/coap-image-2.PNG)

## For ASE-COAP-ERKO
Dependencies
 - Node v13.9.0
 
MQTT client can be run using the following steps:
 - Clone this repo
 - Install dependecies `npm install`
 - In a second terminal provide a runtime key and run client `KEY=testpassword1234 npm run client`
 - Use `Ctrl+C` to kill the process (the business logic is very simple - a random temperature is pushed to the subscribers each 3000ms until it is killed)

## How it works
The connection uses application-level encryption based on AES-128 in CBC mode with a pre-shared key provided as an environment variable and a known (hardcoded) IV. 

For simplicity's sake we used the same script file as "both clients" but this is irrelevant - we could repeat the setup process for another client instance and process incoming data the exact same way, and the data would still be encryted. 

Take a look at the data captured in Wireshark, it's encrypted:

![mqtt-encrypted](./media/mqtt-image-2.PNG)
