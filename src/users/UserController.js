const bcrypt = require('bcryptjs');
const User = require('./User');

module.exports = {

  async authenticate(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Inavlid password' });
    }

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
