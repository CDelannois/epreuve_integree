const { ObjectId } = require('bson');
const mongoose = require('mongoose');


const callHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date required'],
    },
    room: {
        type: String,
        required: [true, 'Room number required'],
    },
    location: {
        type: ObjectId,
        required: [true, 'Button ID required']
    },
    service: {
        type: ObjectId,
        required: [true, 'Service ID required']
    },
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

module.exports = CallHistory;