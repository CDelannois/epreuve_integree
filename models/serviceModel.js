const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    key: {
        type: Number,
        required: [true, 'Service key required.'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Service name required.'],
        unique: true,
    },
    absentPhone: {
        type: String,
        required: [true, 'Service absent phone number required.'],
        unique: true,
    },
    level1: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 1 functions ID required'],
    },
    level2: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 2 functions ID required'],
    },
    level3: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 3 functions ID required'],
    },
});


const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
