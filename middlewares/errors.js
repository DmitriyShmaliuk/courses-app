module.exports = function(req, res) {
  req.flash('processError', '404 Page is not found');
  res.redirect('/error');
}