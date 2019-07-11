const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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

    res.setHeader("Authorization", generateToken({ id: user.id }));
    return res.json({ user });
  },

  async profile(req, res) {
    jwt.verify(req.headers.authorization, authConfig.secret, async (err, decoded) => {
      const user = await User.findById(decoded.id);


      if (err) return res.json(err);
      if (!user) return res.json({ error: "User not found" });

      res.setHeader("Authorization", generateToken({ _id: user.id }));
      return res.json({ name: user.name, email: user.email, photo: `http://localhost:3333/files/${user.photo}` });
    });
  },

  async store(req, res) {
    const {
      name, email,
    } = req.body;

    const { filename: photo } = req.file;

    let { password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    password = hash;

    const status = 1;

    const filename = `${Date.now().toString(36)}.jpg`;

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(
        path.resolve(req.file.destination, 'resized', filename),
      );

    fs.unlinkSync(req.file.path);

    const user = await User.create({
      name, email, password, status, photo: filename,
    });

    req.io.emit('user', user);

    user.password = undefined;

    res.setHeader("Authorization", generateToken({ id: user.id }));

    req.io.emit('user', user);

    return res.json({ user });
  },
};
