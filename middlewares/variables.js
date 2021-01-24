const User = require('../models/user');

module.exports = async function(req, res, next) {
  try {
    if (req.session.isAuth) {
      res.locals.isAuth = req.session.isAuth;
      req.user = await User.findById(req.session.user._id);
    }

    res.locals.csrf = req.csrfToken();
    next();
  } catch (err) {
    res.redirect('/error');
  }
}