const mongoose = require('mongoose');

const careSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Care name required'],
        unique: true
    },
    key: {
        type: Number,
        required: [true, 'Care key required'],
        unique: true
    },
}, {
    collection: 'cares',
    versionKey: false
});

const Care = mongoose.model('Care', careSchema);

module.exports = Care;