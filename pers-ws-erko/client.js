const WebSocket = require('ws');
const fs = require('fs');

async function main () {

    const url = process.argv[2];
    const path = process.argv[3];

    if (!url || !path) {
        console.log('Usage: node client.js <url> <path>');
        return;
    }

    let client = new WebSocket(url);

    client.on('message', message => {
        // TODO:: Overwrite file if update
        // TODO:: Do nothing otherwise
        console.log(`Update: ${msg}`);
    });
    
    await new Promise(resolve => client.once('open', resolve));
    
    // Sync on save
    fs.watchFile(path, (curr, prev) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            client.send(data);
        });
    });
}

main();