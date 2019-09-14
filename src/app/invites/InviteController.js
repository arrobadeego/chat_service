const jwt = require('jsonwebtoken');
const User = require('../users/User');
const authConfig = require('../../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  // async list(req, res) {
  //   jwt.verify(req.headers.authorization, authConfig.secret, async (err, decoded) => {
  //     const user = await User.findById(decoded.id);

  //     res.setHeader("Authorization", generateToken({ id: user.id }));

  //     // eslint-disable-next-line no-underscore-dangle
  //     const ids = user.requests.map(request => request.user_id);

  //     const requests = await User.find({ _id: { $in: ids } });

  //     const email = requests.map(request => request.email);

  //     return res.json({ email });
  //   });
  // },

  async store(req, res) {
    jwt.verify(req.headers.authorization, authConfig.secret, async (err, decoded) => {
      const user = await User.findById(decoded.id);
      const invited = await User.findById(req.body.id);

      if (err) return res.json(err);

      user.sent.push({ user_id: req.body.id });
      invited.received.push({ user_id: user.id });

      user.save();
      invited.save();

      res.setHeader("Authorization", generateToken({ _id: user.id }));
      return res.json({ user });
    });
  },

  async friendRequest(req, res) {
    jwt.verify(req.headers.authorization, authConfig.secret, async (err, decoded) => {
      const user = await User.findById(decoded.id);
      const request = await User.findById(req.body.id);

      if (err) return res.json(err);
      if (!user) return res.json({ error: "User not found" });
      if (!request) return res.json({ error: "Invite not found" });

      if (req.body.isAccepted) {
        // eslint-disable-next-line no-underscore-dangle
        user.contacts.push({ user_id: request._id, status: 1 });
        // eslint-disable-next-line no-underscore-dangle
        request.contacts.push({ user_id: user._id, status: 1 });
      }

      // eslint-disable-next-line no-underscore-dangle
      user.received = await user.received.filter(r => String(r.user_id) !== String(request._id));
      // eslint-disable-next-line no-underscore-dangle
      request.sent = await request.sent.filter(r => String(r.user_id) !== String(user._id));

      user.save();
      request.save();

      res.setHeader("Authorization", generateToken({ _id: user.id }));
      return res.json({ user });
    });
  },
};
