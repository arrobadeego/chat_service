// eslint-disable-next-line import/order
const app = require('./App');

// app.server.listen(3333);

// const server = require('http').createServer(app);

// eslint-disable-next-line import/order
// const io = require('socket.io')(server);

// io.on('connection', socket => {
//   console.log(`Socket connected${socket}`);

//   io.on('sendMessage', s => {
//     console.log(s);
//   });
// });

// const server = require('http').createServer(app);

// const io = require('./config/socket')(app);
// const io = require('socket.io')(server);

// io.on('connection', client => {
//   console.log(`Pau no cu do Passivão${client}`);
// });

// server.listen(3000);

const io = require('socket.io')(app);

io.on('connection', client => {
  console.log(`Socket connected ${client}`);
});

app.listen(3333);
