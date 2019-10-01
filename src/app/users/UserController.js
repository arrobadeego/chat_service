const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('./User');
const authConfig = require('../../config/auth.js');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
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

    res.setHeader('Authorization', generateToken({ id: user._id }));

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

    const { email, oldPassword } = req.body;

    let user = await User.findOne({ _id: req.userId });

    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    user = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      new: true,
    });

    res.setHeader('Authorization', generateToken({ id: user.id }));

    return res.json(user);
  },

  async profile(req, res) {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.json('User not found').status(404);
    }

    res.setHeader('Authorization', generateToken({ id: user._id }));

    console.log(req.io);

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar_id: user.avatar,
    });
  },
};
