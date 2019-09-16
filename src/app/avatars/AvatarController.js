const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('../users/User');
const authConfig = require('../../config/auth.js');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

function setAvatar(avatar) {
  if (avatar === undefined) {
    return 'http://localhost:3333/files/undefined.jpg';
  }
  return `http://localhost:3333/files/${avatar}`;
}

module.exports = {
  async store(req, res) {
    const user = User.findOne({ id: req.userId });

    return res.json(user);
  },
};
