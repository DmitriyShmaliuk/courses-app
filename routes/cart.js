const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', async (req,res) => {
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

router.post('/add', async (req,res) => {
  const { id } = req.body;

  try {
      const course = await Course.findById(id);
      req.user.addCourseToCart(course);
  }
  catch (err) {
      res.redirect('/error');
  }

  res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const cart = await Cart.delete(id);
      res.status(200).json(cart);
  }
  catch (err) {
      res.redirect('/error');
  }
});

module.exports = router;

function mapCartItems(items) {
  return items.map(item => ({
      ...item.courseId._doc,
      count: item.count,
  }));
}

function calculateTotalPrice(items) {
  return items.reduce((total, item) => {
      return total + item.price * item.count;
  }, 0);
}
