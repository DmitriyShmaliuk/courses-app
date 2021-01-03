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
                ref: 'User',
                required: true,
            },
            count: {
                type: Number,
                default: 1,
            }
        }]
    }
});

module.exports = model('User', schema);