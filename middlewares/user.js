const User = require('../models/user');

module.exports = async function(req, res, next) {
  const candidate = await User.findOne();

  try {
    if (candidate) {
      req.user = candidate;
    } else {
      const newUser = new User ({
        name: 'Dmitriy',
        email: 'shmalyk9000@gmail.com',
        cart: { items: [] },
      });

      await newUser.save();
      req.user = newUser;
    }
  }
  catch (err) {
    console.log(err);
  }

  next();
}