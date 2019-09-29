module.exports = async (req, res, next) => {
  // global.io.on('connect', ws => {
  //   console.log(`Socket connected ${ws}`);

  //   // ws.on('sendMessage', data => {
  //   //   console.log(data);
  //   // });

  //   // ws.emit('notifyInvite', { id: 1 });
  // });
  req.io = global.io;
  return next();
};
