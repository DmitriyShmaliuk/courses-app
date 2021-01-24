const { Router } = require('express')
const router = new Router();

router.get('/', (req, res) => {
  res.render('auth', {
    title: 'Login',
    isAuthorization: true,
  })
});

module.exports = router;