const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ 'userId': req.user });
    const populatedOrders = await populateOrders(orders);
    const mapedOrders = mapOrders(populatedOrders);

    res.render('orders', {
      title: 'Orders',
      isOrders: true,
      orders: mapedOrders,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/add', async (req, res) => {
  try {
    const { cart: { items } } = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const order = new Order({ courses: items, userId: req.user });
    await order.save();

    req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

function populateOrders(orders) {
  const result = orders.map(order => {
    return new Promise(async (resolve, reject) => {
      try {
        const populatedOrder = await order.populate('courses.courseId userId').execPopulate();
        resolve(populatedOrder);
      } catch (err) {
        reject(err);
      }
    });
  });

  return Promise.all(result);
}

function mapOrders(orders) {
  return orders.map(order => {
    const { date, _id: id } = order;
    const courses = mapCourses(order.courses);
    const totalPrice = calculateTotalPrice(courses);

    const user = {
      name: order.userId.name,
      email: order.userId.email,
    };

    return { user, date, id, courses, totalPrice };
  });
};

function mapCourses(courses) {
  return courses.map(course => ({
    count: course.count,
    name: course.courseId.name,
    price: course.courseId.price,
  }));
}

function calculateTotalPrice(courses) {
  return courses.reduce((total, { price, count }) => {
    return total + price * count;
  }, 0);
};
