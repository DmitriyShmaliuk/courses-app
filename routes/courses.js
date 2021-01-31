const { Router } = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middlewares/auth');
const router = Router();

function isOwner(course, userId) {
  return course.userId.toString() === userId.toString();
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    const userId = req.user && req.user._id.toString();

    res.render('courses', {
      title: 'Courses',
      isCourses: true,
      courses,
      userId,
    });
  } catch (err) {
    req.flash('processError', err);
    res.redirect('/error');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (course) {
    res.render('course', {
      title: `Course ${course.name}`,
      layout: 'empty',
      course,
    });
  }
  else {
    req.flash('processError', err);
    res.redirect('/error');
  }
});

router.get('/:id/edit', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { allow } = req.query;
    const course = await Course.findById(id);

    if (allow && isOwner(course, req.user._id)) {
      res.render('course-edit', {
        title: `Edit ${course.name}`,
        course
      });
    } else {
      res.redirect('/courses');
    }
  } catch (err) {
    req.redirect('/error');
  }
});

router.post('/edit', authMiddleware, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  try {
    const course = await Course.findById(id);

    if (isOwner(course, req.user._id)) {
      Object.assign(course, req.body);
      await course.save();
    }

    res.redirect('/courses');
  }
  catch (err) {
    res.redirect('/error')
  }
});

router.post('/remove', authMiddleware, async (req, res) => {
  const { id } = req.body;

  try {
    await Course.findOneAndDelete({_id: id, userId: req.user });
    res.redirect('/courses');
  }
  catch (err) {
    req.flash('processError', err);
    res.redirect('/error');
  }
});

module.exports = router;