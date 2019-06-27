const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb+srv://admin:12345@cluster0-vybfh.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.io = io;

  next();
});

const corsOptions = {
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));

app.use(require('./routes'));

app.listen(3333);
