const jwt = require('jsonwebtoken');
const User = require('../users/User');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  async list(req, res) {
    jwt.verify(req.headers.authorization, authConfig.secret, async (err, decoded) => {
      const user = await User.findById(decoded.id);
      res.setHeader("Authorization", generateToken({ id: user.id }));

      const contactsIds = user.contacts.map(contact => contact.user_id);
      const contactsList = await User.find({ _id: { $in: contactsIds } });
      // eslint-disable-next-line no-underscore-dangle
      const contacts = contactsList.map(contact => ({ id: contact._id, name: contact.name, status: contact.status }));

      return res.json({ contacts });
    });
  },
};
