const { Router } = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middlewares/auth');
const router = Router();

router.get('/', authMiddleware, async (req,res) => {
  const { cart } = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(cart.items);
  const totalPrice = calculateTotalPrice(courses);

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    totalPrice,
    courses,
  });
});

router.post('/add', authMiddleware, async (req,res) => {
  const { id } = req.body;

  try {
    const course = await Course.findById(id);
    req.user.addCourseToCart(course);
  }
  catch (err) {
    req.flash('processError', err);
    res.redirect('/error');
  }

  res.redirect('/cart');
});

router.delete('/remove/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    await req.user.removeFromCart(course);

    const { cart } = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(cart.items);
    const totalPrice = calculateTotalPrice(courses);

    res.status(200).json({ courses, totalPrice });
  }
  catch (err) {
    req.flash('processError', err);
    res.redirect('/error');
  }
});

module.exports = router;

function mapCartItems(items) {
  return items.map(item => ({
    ...item.courseId._doc,
    id: item.courseId.id,
    count: item.count,
  }));
}

function calculateTotalPrice(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.count;
  }, 0);
}
