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
    
    const file = fs.readFileSync(path, 'utf-8');

    client.on('message', msg => console.log(`Update: ${msg}`));
    
    await new Promise(resolve => client.once('open', resolve));
    
    client.send(file);
}

main();