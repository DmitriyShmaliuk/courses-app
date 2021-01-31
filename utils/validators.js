const { body } = require('express-validator');
const User = require('../models/user');

exports.registrationValidators = [
  body('email').isEmail().withMessage('There is not email').custom(findUserByEmail).normalizeEmail(),
  body('name').isLength({ min: 3 }).withMessage('Name can not be less than 3 symbols').trim(),
  body('passsword').isLength({ min: 8 }).isAlphanumeric(),
  body('confirmPassword').custom(comparePasswords).withMessage('Passwords do not match'),
];

function comparePasswords(value, { req }) {
  return value === req.body.password;
}

async function findUserByEmail(email) {
  const candidate = await User.findOne({ email });
  return candidate ? Promise.reject('There is user with this email') : Promise.resolve();
}
