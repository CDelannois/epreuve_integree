const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const actageSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    collaborator: {
        type: ObjectId,
    },
    reason: {
        type: String,
    },
    _id: false,
});

const callHistorySchema = new mongoose.Schema({
    beginDate: {
        type: Date,
        required: [true, 'Date required'],
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: 0
    },
    room: {
        type: String,
        required: [true, 'Room number required'],
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Button',
        required: [true, 'Button ID required']
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Service ID required']
    },
    actage: {
        type: actageSchema,
    }
}, {
    collection: 'callhistories',
    versionKey: false
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

module.exports = CallHistory;