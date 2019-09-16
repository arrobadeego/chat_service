const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Yup = require('yup');
const path = require('path');
const fs = require('fs');

const User = require('./User');
const authConfig = require('../../config/auth.js');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

function setPhoto(photo) {
  if (photo === undefined) {
    return 'http://localhost:3333/files/undefined.jpg';
  }
  return `http://localhost:3333/files/${photo}`;
}

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let { password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    password = hash;

    const status = 1;

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      status,
    });

    res.setHeader('Authorization', generateToken({ id: user.id }));

    user.password = undefined;

    return res.json({ user });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      new: true,
    });

    return res.json(user);
  },

  async profile(req, res) {
    jwt.verify(
      req.headers.authorization,
      authConfig.secret,
      async (err, decoded) => {
        const user = await User.findById(decoded.id);

        if (err) return res.json(err);
        if (!user) return res.json({ error: 'User not found' });

        res.setHeader('Authorization', generateToken({ _id: user.id }));

        return res.json({
          name: user.name,
          email: user.email,
          photo: setPhoto(user.photo),
        });
      }
    );
  },
};