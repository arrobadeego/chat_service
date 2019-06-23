const User = require('./User');

module.exports = {

  async index(req, res) {
    const user = await User.find();
    return res.json(user);
  },

  async store(req, res) {
    const {
      name, email, password, status,
    } = req.body;

    const user = await User.create({
      name, email, password, status,
    });

    req.io.emit('user', user);

    return res.json(user);
  },
};
