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

class AvatarController {
  async store(req, res) {
    const { avatar } = req.body;

    if (!avatar) {
      return res.json({ error: "Avatar can't be blank" }).status(400);
    }

    const user = await User.findOneAndUpdate({ _id: req.userId }, avatar, {
      new: true,
    });

    return res.json(user);
  }
}

module.exports = new AvatarController();
