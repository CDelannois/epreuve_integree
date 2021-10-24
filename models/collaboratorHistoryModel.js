const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const collaboratorHistorySchema = new mongoose.Schema({
    collaborator: {
        type: ObjectId,
        required: [true, 'Collaborator ID required'],
    },
    loginDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Login date is required'],
    },
    logoutDate: {
        type: Date,
        default: 0,
    },
    phone: {
        type: String,
        required: [true, 'Phone number required'],
    },
    service: {
        type: ObjectId,
        required: [true, 'Service ID required'],
    },
});

const CollaboratorHistory = mongoose.model('CollaboratorHistory', collaboratorHistorySchema);

module.exports = CollaboratorHistory;