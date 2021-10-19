const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: [true, 'Collaborator status required.'],
    },
    name: {
        type: String,
        required: [true, `Collaborator's name is required.`],
    },
    tts: {
        type: String,
        required: [true, `Collaborator's text to speech is required.`],
    },
    function: {
        type: ObjectId,
        required: [true, 'Function ID required.'],
    },
    password: {
        type: String,
        required: [true, 'Collaborator pin code required.'],
    },
    timeBeforeDisconnect: {
        type: Number,
        required: [true, 'Time before automatic disconnection is required.']
    },
    mail: {
        type: String,
        validate: function (mailInput) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailInput);
        },
        required: [true, `Collaborator's mail address is required.`],
        unique: true,
    },
    active: {
        type: Boolean,
        required: [true, `Collaborator's active status is required.`]
    },
});

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

module.exports = Collaborator;