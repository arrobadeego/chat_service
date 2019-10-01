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
    const user = await User.findOne({ _id: req.userId });

    const userRequest = await User.findOne({ _id: req.body.user_id });

    if (
      user.received.filter(r => {
        return String(r.user_id) === String(userRequest._id);
      }).length === 0
    ) {
      return res.json('This invite not exists').status(400);
    }

    await User.update(
      { _id: user._id },
      { $pull: { received: { user_id: userRequest._id } } }
    );

    await User.update(
      { _id: userRequest._id },
      { $pull: { sent: { user_id: user._id } } }
    );

    if (req.body.isAccept) {
      user.contacts.push({
        user_id: userRequest._id,
        name: userRequest.name,
        email: userRequest.email,
      });

      userRequest.contacts.push({
        user_id: user._id,
        name: user.name,
        email: user.email,
      });
    }

    await user.save();
    await userRequest.save();

    res.json(user);
  },
};
