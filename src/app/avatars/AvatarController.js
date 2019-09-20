const jwt = require('jsonwebtoken');

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
    const { filename } = req.file;

    if (!filename) {
      return res.json({ error: "Avatar can't be blank" }).status(400);
    }

    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: setAvatar(filename) },
      {
        new: true,
      }
    );

    res.setHeader('Authorization', generateToken({ id: user.id }));

    return res.json(user);
  }
}

module.exports = new AvatarController();
