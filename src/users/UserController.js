const User = require('./User');

module.exports = {

  async store(req, res) {
    const {
      name, email, password, status,
    } = req.body;

    const user = await User.create({
      name, email, password, status,
    });

    return res.json(user);
  },
};
