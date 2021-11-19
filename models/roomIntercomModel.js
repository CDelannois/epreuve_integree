const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    beginning: {
        type: Number,
        required: [true, 'Presence beginning message required.'],
    },
    end: {
        type: Number,
        required: [true, 'Presence ending message required.'],
    },
    _id: false,
})

const callSchema = new mongoose.Schema({
    level1: {
        type: Number,
        required: [true, 'Level 1 message is required'],
    },
    level2: {
        type: Number,
        required: [true, 'Level 2 message is required'],
    },
    level3: {
        type: Number,
        required: [true, 'Level 3 message required.'],
    },
    handling: {
        type: Number,
        required: [true, 'Handling message required.'],
    },
    presence: {
        type: presenceSchema,
        required: [true, 'Presence messages required.'],
    },
    actage: {
        type: Number,
        required: [true, 'actage message required'],
    },
    _id: false,
});


const roomIntercomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: [true, 'Room number required.'],
        unique: true,
    },
    roomPhone: {
        type: String,
        required: [true, `Room's phone required.`],
        unique: true,
    },
    call: {
        type: callSchema,
        required: [true, `Call messages required.`],
    },
}, {
    collection: 'roomintercoms',
    versionKey: false
});

const RoomIntercom = mongoose.model('RoomIntercom', roomIntercomSchema);

module.exports = RoomIntercom;