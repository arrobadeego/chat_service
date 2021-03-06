const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const Yup = require('yup');

const User = require('../users/User');
const authConfig = require('../../config/auth.js');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Inavlid password' });
    }

    user.password = undefined;

    res.setHeader('Authorization', generateToken({ id: user._id }));

    const contacts = user.contacts.map(async contact => {
      await User.findOne(
        { _id: contact.user_id },
        { name: 1, email: 1, status: 1, _id: 1, avatar: 1 }
      );
    });

    return res.json({
      user,
      contacts,
    });
  },
};
