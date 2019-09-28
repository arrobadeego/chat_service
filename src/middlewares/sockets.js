// const MasterSocket = require('../MasterSocket');
const { myWebsocket } = require('../App');

module.exports = async (req, res, next) => {
  // websocket.on('connection', socket => {

  console.log(`deu certo! ${myWebsocket.socket}`);
  // });
  return next();
};
