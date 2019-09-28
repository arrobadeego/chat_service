const WebSocket = require('ws');

const Socket = function() {
  this.mywss = new WebSocket.Server({ port: 8989 });
};

Socket.prototype.broadcast = function() {};

Socket.prototype.connection = function() {};

Socket.prototype.emit = function() {
  // aqui pode chamar this.mywss.emit() *eu acho que emit assim*
};

module.exports = new Socket();
