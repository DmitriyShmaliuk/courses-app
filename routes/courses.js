const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAll();

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const course = await Course.getById(id);

    console.log(course);

    if (course) {
        res.render('course', {
            title: `Course ${course.name}`,
            layout: 'empty',
            course
        }); 
    }
    else {
        res.redirect('error');
    }
});

module.exports = router;