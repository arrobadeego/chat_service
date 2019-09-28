const express = require('express');
const path = require('path');
const cors = require('cors');
// const WebSocket = require('ws');
// const MasterSocket = require('./MasterSocket');
const routes = require('./routes/routes');

require('./database');

class App {
  constructor() {
    this.app = express();

    this.server = require('http').Server(this.app);

    // this.myWebsocket = new WebSocket.Server({ server: this.server });
    this.io = require('socket.io')(this.server);

    // this.socket = new MasterSocket(this.myWebsocket);

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(
      cors({
        exposedHeaders: 'Authorization',
      })
    );
    this.app.use(express.json());

    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}
const { server, io } = new App();
module.exports = { server, io };
