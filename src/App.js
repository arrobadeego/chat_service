const express = require('express');
const path = require('path');
const cors = require('cors');

// require('./config/socket');

const routes = require('./routes/routes');

require('./database');

class App {
  constructor() {
    this.app = express();

    this.server = require('http').Server(this.app);
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

module.exports = new App().server;
