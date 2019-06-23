const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/User');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

  async store(req, res) {
    jwt.verify(req.headers.token, authConfig.secret, async (err, decoded) => {
      const user = await User.findById(decoded.id);
      if (err) return res.json(err);
      user.contacts.push(req.body.id);
      res.setHeader("token", generateToken({ id: user.id }));
      return res.json({ user });
    });
  },
};