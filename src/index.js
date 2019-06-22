const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb+srv://admin:12345@cluster0-vybfh.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

app.use(cors());
app.use(require('./routes'));

app.listen(3333);
