const { Router } = require('express');
const Course = require('../models/courses');
const Cart = require('../models/cart');
const router = Router();

router.get('/', async (req,res) => {
    const cart = await Cart.fetch();

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses: cart.courses,
        totalPrice: cart.price,
    });
});

router.post('/add', async (req,res) => {
    const { id } = req.body;

    try {
        const course = await Course.getById(id);
        await Cart.add(course);
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