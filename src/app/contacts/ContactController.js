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
    let user = await User.findOne({ _id: req.userId });

    let userRequest = await User.findOne({ _id: req.body.user_id });

    if (
      user.received.filter(r => {
        return String(r.user_id) === String(userRequest._id);
      }).length === 0
    ) {
      return res.json('This invite not exists').status(400);
    }

    user = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { received: { user_id: userRequest._id } } },
      { new: true }
    );

    userRequest = await User.findOneAndUpdate(
      { _id: userRequest._id },
      { $pull: { sent: { user_id: user._id } } },
      { new: true }
    );

    if (req.body.isAccept) {
      user.contacts.push({
        user_id: userRequest._id,
        name: userRequest.name,
        status: userRequest.status,
        avatar: userRequest.avatar,
      });

      userRequest.contacts.push({
        user_id: user._id,
        name: user.name,
        status: user.status,
        avatar: user.avatar,
      });
    }

    await user.save();
    await userRequest.save();

    user = await User.findOne({ _id: req.userId });

    return res.json(user);
  },

  async show(req, res) {
    const user = await User.findOne({ _id: req.userId });

    const contact = await User.findOne({ _id: req.params.user_id });

    // console.log(req.body);
    console.log(req.params.user_id);

    if (
      user.contacts.filter(c => {
        return String(c.user_id) === String(contact._id);
      }).length === 0
    ) {
      return res.json('You and him are not contacts').status(400);
    }

    // user = await User.findOneAndUpdate(
    //   { _id: user._id },
    //   { $pull: { received: { user_id: userRequest._id } } },
    //   { new: true }
    // );

    // await user.save();

    // user = await User.findOne({ _id: req.userId });

    return res.json(contact);
  },
};
