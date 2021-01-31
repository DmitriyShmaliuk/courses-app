const { Router } = require('express')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const sendRegistrationEmails = require('../emails/registration');
const sendRestPasswordEmail = require('../emails/resetPassword');
const { registrationValidators } = require('../utils/validators');

const router = new Router();

router.get('/', (req, res) => {
  res.render('auth', {
    title: 'Login',
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
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

      req.flash('loginError', 'Error: There is not user with this email or password is not correct.');
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

router.post('/register', registrationValidators, async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth#register');
    }

    const hasPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hasPassword, cart: { items: [] }});
    await newUser.save();

    sendRegistrationEmails(email);
    res.redirect('/auth#login');
  } catch (err) {
    res.redirect('/error');
  }
});

router.get('/reset', (req, res) => {
  res.render('reset', {
    title: 'Reset password',
    error: req.flash('error'),
  })
});

router.post('/reset', async (req, res) => {
  const { email } = req.body;

  try {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      req.flash('error', 'User with this email is not found');
      return res.redirect('/auth#login');
    }

    candidate.resetToken = crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong, try again later');
        return res.redirect('/auth#login');
      }

      candidate.resetToken = buffer.toString('hex');
      candidate.resetTokenExp = Date.now() + 3600 * 1000;

      await candidate.save();
      res.redirect('/auth#login');

      sendRestPasswordEmail(email, candidate.resetToken);
    })

  } catch (err) {
    res.redirect('/error');
  }
});

router.get('/reset/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const candidate = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if(!candidate) {
      req.flash('error', 'User is not found');
      return res.redirect('/auth#login');
    }

    res.render('password', {
      title: 'New password',
      error: req.flash('error'),
      token: token,
      email: candidate.email,
      id: candidate._id.toString(),
    });
  } catch (err) {
    res.redirect('/error');
  }
});

router.post('/password', async (req, res) => {
  const { email, id, token, password, confirmPassword } = req.body;

  try {
    const candidate = await User.findOne({
      email,
      _id: id,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (candidate) {
      if (password !== confirmPassword) {
        req.flash('error', 'Passwords are not match');
        return res.redirect(`/auth/reset/${token}`);
      }

      candidate.password = await bcrypt.hash(password, 12);
      await candidate.save();
    } else {
      req.flash('error', 'User is not found');
    }

    res.redirect('/auth#login');
  } catch (err) {
    res.redirect('/error');
  }
});

module.exports = router;
