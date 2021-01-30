const { Router } = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middlewares/auth');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();

  res.render('courses', {
      title: 'Courses',
      isCourses: true,
      courses
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (course) {
    res.render('course', {
      title: `Course ${course.name}`,
      layout: 'empty',
      course
    });
  }
  else {
    res.redirect('/error');
  }
});

router.get('/:id/edit', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { allow } = req.query;

  if (allow) {
    const course = await Course.findById(id);

    res.render('course-edit', {
      title: `Edit ${course.name}`,
      course
    });
  }
  else {
    res.redirect('/courses');
  }
});

router.post('/edit', authMiddleware, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  try {
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
  }
  catch (err) {
    res.redirect('/error')
  }
});

router.post('/remove', authMiddleware, async (req, res) => {
  const { id } = req.body;

  try {
    await Course.findByIdAndDelete(id);
    res.redirect('/courses');
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;