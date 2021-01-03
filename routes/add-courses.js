const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', (req, res) => {
    res.render('add-courses', {
        title: 'Add courses',
        isAdd: true,
    });
});

router.post('/', async (req, res) => {
    const { name, price, image } = req.body;
    const course = new Course({name, price, image, userId: req.user });
    
    try {
        await course.save();
        res.redirect('/courses');
    }
    catch(err) {
        console.log(err);
    }
})

module.exports = router;