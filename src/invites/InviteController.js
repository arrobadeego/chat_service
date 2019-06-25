const jwt = require('jsonwebtoken');
const User = require('../users/User');
const authConfig = require('../config/auth.json');

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

      res.setHeader("Authorization", generateToken({ _id: user.id }));
      return res.json({ user });
    });
  },
};
