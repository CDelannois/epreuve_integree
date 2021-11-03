const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Presence date required'],
    },
    users: {
        type: ObjectId,
        required: [true, 'Collaborator ID required'],
    },
    _id: false,
});

const actageSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Presence date required'],
        default: 0,
    },
    collaborator: {
        type: ObjectId,
        required: [true, 'Collaborator ID required'],
        default: '0000a0a00a0aaa000a0a00aa',
    },
    reason: {
        type: String,
        required: [true, 'Call reason required'],
        default: "",
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
        default: Date.now
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
    presence: {
        type: [presenceSchema]
    },
    actage: {
        type: actageSchema,
    }
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

module.exports = CallHistory;