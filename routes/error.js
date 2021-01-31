const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('error', {
    title: 'Error',
    message: req.flash('processError'),
  })
});

module.exports = router;
