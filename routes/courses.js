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

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const { allow } = req.query;
    
    if (allow) {
        const course = await Course.getById(id);

        res.render('course-edit', {
            title: `Edit ${course.name}`,
            course
        });
    }
    else {
        res.redirect('/courses');
    }
});

router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/courses');
});

module.exports = router;