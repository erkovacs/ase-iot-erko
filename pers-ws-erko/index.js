const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

let xml = `<test>
<somestuff/>
</test>`;

const server = new WebSocket.Server({
  port: PORT
});

let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);

  socket.on('message', function(msg) {
    // TODO:: Set xml if we have nothing
    // reconcile xml we have with what we receive
    // Then send merged file to all clients
    sockets.forEach(socket => socket.send(msg));
  });

  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});