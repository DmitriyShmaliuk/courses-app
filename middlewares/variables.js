module.exports = function(req, res, next) {
  res.locals.isAuth = req.session.isAuth;
  req.user = req.session.user;
  next();
}