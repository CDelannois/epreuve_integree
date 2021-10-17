const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    breakfast: {
        type: Number,
        required: [true, 'Breakfast message required.']
    },
    lunch: {
        type: Number,
        required: [true, 'Lunch message required.']
    },
    diner: {
        type: Number,
        required: [true, 'Diner message required.']
    },
    _id: false,
});

const beginEndSchema = new mongoose.Schema({
    begin: {
        type: Number,
        required: [true, 'Fire beginning message required.'],
    },
    end: {
        type: Number,
        required: [true, 'Fire ending message required.'],
    },
    _id: false,
});

const fireSchema = new mongoose.Schema({
    fire: {
        type: beginEndSchema,
        required: [true, 'Fire incident messages required.'],
    },
    _id: false,
});

const eventSchema = new mongoose.Schema({
    meal: {
        type: mealSchema,
        required: [true, 'Call messages required.'],
    },
    help: {
        type: Number,
        required: [true, 'Help message required.'],
    },
    fire: {
        type: fireSchema,
        required: [true, 'Fire incident messages required.'],
    },
    activity: {
        type: Number,
        required: [true, 'Actage message required.'],
    },
    _id: false,
});

const serviceIntercomSchema = new mongoose.Schema({
    service: {
        type: ObjectId,
        required: [true, 'Service ID required.'],
        unique: true,
    },
    event: {
        type: eventSchema,
        required: [true, `Event messages required.`],
    },
});

const ServiceIntercom = mongoose.model('ServiceIntercom', serviceIntercomSchema);

module.exports = ServiceIntercom;
