const express = require('express');
//const mongoose = require('mongoose');
const cors = require('cors');
//const bodyParser = require('body-parser');
const path = require('path');
//const io = require('socket.io')(server);
const routes = require('./routes/routes');

// mongoose.connect('mongodb+srv://admin:12345@cluster0-vybfh.mongodb.net/test?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
// });

// app.use((req, res, next) => {
//   req.io = io;

//   next();
// });


class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));
  }


  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
