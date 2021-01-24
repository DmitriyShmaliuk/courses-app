const { Router } = require('express')
const bcrypt = require('bcrypt');
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
  const { email, password } = req.body;

  try {
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;

        return req.session.save((err) => {
          if (err) {
            throw err;
          }

          res.redirect('/');
        });
      }

      res.redirect('/auth#login');
    }
  }
  catch (err) {
    res.redirect('/error');
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
  const { email, name, password, confirmPassword } = req.body;

  try {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      const hasPassword = await bcrypt.hash(password, 12);
      const areSame = await bcrypt.compare(hasPassword, confirmPassword);

      if (areSame) {
        const newUser = new User({ email, name, password: hasPassword, cart: { items: [] }});
        await newUser.save();

        return res.redirect('/');
      }

      res.redirect('/auth#register');
    } else {
      res.redirect('/auth#login');
    }

  } catch (err) {
    res.redirect('/error');
  }
})

module.exports = router;