const User = require('../users/User');

module.exports = {

  async store(req, res) {
    console.log(req);

    try {
      const {
        name, email, password,
      } = req.body;

      const status = 1;

      const user = await User.create({
        name, email, password, status,
      });

      return res.json(user);
    } catch (err) {
      return res.json(err);
    }
  },
};
