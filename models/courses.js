const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: String,
});

module.exports = model('Course', schema);