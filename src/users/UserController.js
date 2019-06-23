const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

  async authenticate(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Inavlid password' });
    }

    user.password = undefined;

    res.setHeader("token", generateToken({ id: user.id }));
    return res.json({ user });
  },

  async store(req, res) {
    const {
      name, email, password, status,
    } = req.body;

    const user = await User.create({
      name, email, password, status,
    });

    req.io.emit('user', user);

    user.password = undefined;

    res.setHeader("token", generateToken({ id: user.id }));
    return res.json({ user });
  },
};
