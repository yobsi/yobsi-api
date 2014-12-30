'use strict';

var config = require('./environment/index.js');


function onDisconnect (socket) {
}

function onConnect (io, socket) {
  console.log('===================== on connect');
  require('../transactions/job/job.socket.js').register(io, socket);
}

// function createUserRoom (socket, next) {
//   var email = socket.handshake.user.email;
//   socket.join(email);
//   console.log(email + ' room created');
//   next();
// }

function createUserRoom (socket, email) {
  socket.join(email);
  console.log(email + ' room created');
}

module.exports = function (io) {
  // io.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  // io.use(createUserRoom);

  io.on('connection', function (socket) {
    onConnect(io, socket);

    socket.on('connectServer', function (data) {
      createUserRoom(socket, data.email);
    });

    socket.on('disconnect', function () {
      onDisconnect(socket);
    });
  });
};