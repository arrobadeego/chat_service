const app = require('./App');

global.io = app.io;

app.server.listen(3333);
