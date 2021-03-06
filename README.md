# ASE IOT Projects

## Dependencies
 - Node v13.9.0

## Prerequisites
 - Clone this repo
 - Install dependecies `npm install`

## For ASE-COAP-ERKO

 COAP Client and Server can be run using the following steps:
 - In a terminal run server `npm run coap-server`
 - In a second terminal run client `npm run coap-client`
 - Use `Ctrl+C` to kill either process (the business logic is very simple - a random "room temperature" is pushed to the server every 3000ms until the client is killed - the server responds with a status flag and some metadata)

## How it works
The connection uses application-level encryption based on RSA with N=2048. The Client and the Server each generate a key pair at runtime and exchange their public keys over a public (unsecure) channel, after which they will communicate over a secure channel using RSA Signatures and Encryption.
The messages transmitted consists of two concatenated byte arrays - the signature, of known length, followed by the payload (simple JSON string) ex. `[signature][encrypted payload]`

There are two scripts, one for the client and one for the server. They must be run in parallel so they can talk to each other over localhost:

![client-server](./media/client-server.PNG)

Take a look at the key exchange cycle (plaintext) in Wireshark:

![coap-key-exchange](./media/coap-image-rsa-1.PNG)

Subsequently all payloads are encrypted:
![coap-encrypted](./media/coap-image-rsa-2.PNG)

Strictly speaking, this is more of a demonstration/toy project, and it would make much more sense to optimize this scheme after the following logic:
- Exchange keys as shown here
- Authenticate the parties to each other using signatures, as shown here
- Do not encrypt all traffic using RSA. Rather, exchange only one message, an agreed-upon session-specific symmetric key over the secure channel
- Continue the encrypted chat using a faster symmetric key encryption such as AES using the key shared over the secure channel 

## For ASE-MQTT-ERKO
MQTT client can be run using the following steps:
 - In a terminal provide a runtime key and run client (containing both the publisher and the subscriber) `KEY=testpassword1234 npm run mqtt-client`
 - Use `Ctrl+C` to kill the process (the business logic is very simple - a random "room temperature" is published to the broker every 3000ms until it is killed)

## How it works
The connection uses application-level encryption based on AES-128 in CBC mode with a pre-shared key provided as an environment variable and a known (hardcoded) IV. 

For simplicity's sake we used the same script file as "both clients" but this is irrelevant - we could repeat the setup process for another client instance and process incoming data the exact same way, and the data would still be encryted. 

Take a look at the data captured in Wireshark, it's encrypted:

![mqtt-encrypted](./media/mqtt-image-2.PNG)
