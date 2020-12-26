const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', (req, res) => {
    res.render('add-courses', {
        title: 'Add courses',
        isAdd: true,
    });
});

router.post('/', (req, res) => {
    const { name, price, image } = req.body;
    const course = new Course(name, price, image);
    course.save();
    
    res.redirect('/courses');
})

module.exports = router;