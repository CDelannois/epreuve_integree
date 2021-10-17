const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    key: {
        type: Number,
        required: [true, 'Service key required.'],
        unique: true,
    },
    virtual: {
        type: Boolean,
        required: [true, 'Service type required.']
    },
    name: {
        type: String,
        required: [true, 'Service name required.'],
        unique: true,
    },
    absentPhone: {
        type: String,
        required: [true, 'Service absent phone number required.'],
    },
    level1: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 1 functions ID required'],
        default: undefined,
    },
    level2: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 2 functions ID required'],
        default: undefined,
    },
    level3: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === false;
        },
            'Level 3 functions ID required'],
        default: undefined,
    },
    services: {
        type: [ObjectId],
        required: [function () {
            return this.virtual === true;
        },
            'Services ID required'],
        default: undefined,
    },
});


const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
