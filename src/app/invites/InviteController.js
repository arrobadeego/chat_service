const jwt = require('jsonwebtoken');
const User = require('../users/User');
const authConfig = require('../../config/auth.js');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  async store(req, res) {
    if (!req.body.email) {
      return res.json("E-mail can't be blank").status(400);
    }

    const userInvited = await User.findOne({ email: req.body.email });

    if (!userInvited) {
      return res.json("This user doesn't exists").status(400);
    }

    const user = await User.findOne({ _id: req.userId });

    if (
      user.contacts.filter(contact => {
        return String(contact.user_id) === String(userInvited._id);
      }).length !== 0
    ) {
      return res.json('This user is already your contact').status(400);
    }

    if (
      user.sent.filter(s => {
        return String(s.user_id) === String(userInvited._id);
      }).length !== 0
    ) {
      return res.json('This user was already invited').status(400);
    }

    user.sent.push({
      user_id: userInvited._id,
      name: userInvited.name,
      email: userInvited.email,
    });

    userInvited.received.push({
      user_id: user._id,
      name: user.name,
      email: user.email,
    });

    await user.save();
    await userInvited.save();

    req.io.emit('NOTIFY_INVITE', userInvited);

    return res.json({ user, userInvited });
  },
};
