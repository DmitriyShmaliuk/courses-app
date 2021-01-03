const { Schema, model } = require('mongoose');

const schema = new Schema({
  courses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,   
    },
    count: {
      type: Number,
      required: true,
    }
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Order', schema);