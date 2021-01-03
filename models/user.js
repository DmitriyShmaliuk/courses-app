const { Schema, model } = require('mongoose');

const schema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true,
            },
            count: {
                type: Number,
                default: 1,
            }
        }]
    }
});

schema.methods.addCourseToCart = async function(course) {
    const items = [...this.cart.items];
    const candidate = items.find((c) => c.courseId.toString() === course._id.toString());

    if (candidate) {
        candidate.count = candidate.count + 1;
    } else {
        items.push({
            courseId: course._id,
            count: 1,
        });
    }

    this.cart = { items };
    await this.save();
};

module.exports = model('User', schema);