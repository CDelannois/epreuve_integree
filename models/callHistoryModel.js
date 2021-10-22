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
        date: {
            type: Date,
            required: [true, 'Presence date required'],
        },
        users: {
            type: ObjectId,
            required: [true, 'Collaborator ID required'],
        },
        reason: {
            type: String,
            required: [true, 'Call reason required'],
        },
        _id: false,
    }
});

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
    presence: {
        type: [presenceSchema]
    },
    actage: {
        type: actageSchema,
    }
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema);

module.exports = CallHistory;