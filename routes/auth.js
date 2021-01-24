const { Router } = require('express')
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const router = new Router();

router.get('/', (req, res) => {
  res.render('auth', {
    title: 'Login',
    isAuthorization: true,
  })
});

router.post('/login', async (req, res) => {
  const candidate = await User.findById('5ff1c1a3ff5365101e58d6d6');

  try {
    req.session.user = candidate;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }

      res.redirect('/');
    });
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/logout', authMiddleware, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/error');
    }

    res.redirect('/auth#login');
  });
});

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      const newUser = new User({ email, name, password, cart: { items: [] }});
      await newUser.save();

      res.redirect('/');
    } else {
      res.redirect('/auth#login');
    }

  } catch (err) {
    res.redirect('/error');
  }
})

module.exports = router;