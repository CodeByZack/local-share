const { Server } = require("socket.io");

const io = new Server({ cors : { origin : '*' }});

io.on("connection", (socket) => {
  // Handle 'message' messages
  socket.on('message', function (message) {
    log('S --> Got message: ', message);

    socket.broadcast.to(message.channel).emit('message', message);
  });

  // Handle 'create or join' messages
  socket.on('create or join', function (channel) {
    var numClients = io.sockets.adapter.rooms.get(channel)?.size || 0;
    console.log('numclients = ' + numClients);

    // First client joining...
    if (numClients == 0) {
      socket.join(channel);
      socket.emit('created', channel);

    // Second client joining...
    } else if (numClients == 1) {
      socket.join(channel);
      io.sockets.in(channel).emit('remotePeerJoining', channel);

      socket.broadcast.to(channel).emit('broadcast: joined', 'S --> broadcast(): client ' + socket.id + ' joined channel ' + channel);
    } else {
      // max two clients
      console.log("Channel full!");
      socket.emit('full', channel);
    }
  });

  // Utility function used for remote logging
  function log() {
    var array = [">>> "];
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
    console.log(array.map(JSON.stringify).join(''));
    socket.emit('log', array);
  }
});

io.listen(3000);