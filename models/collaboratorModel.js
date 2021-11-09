const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const hash = require('./passwordHash');
const bcrypt = require('bcrypt');

const collaboratorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Collaborator's name is required.`],
    },
    tts: {
        type: String,
        required: [true, `Collaborator's text to speech is required.`],
        lowercase: true
    },
    function: {
        type: ObjectId,
        required: [true, 'Function ID required.'],
    },
    password: {
        type: String,
        required: [true, 'Collaborator pin code required.'],
        select: false
    },
    timeBeforeDisconnect: {
        type: Number,
        required: [true, 'Time before automatic disconnection is required.']
    },
    email: {
        type: String,
        validate: function (mailInput) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailInput);
        },
        required: [true, `Collaborator's mail address is required.`],
        unique: true,
        lowercase: true,
    },
    active: {
        type: Boolean,
        required: [true, `Collaborator's active status is required.`],
        default: false,
    },
    passwordChangedAt: Date
}, {
    collection: 'collaborators',
    versionKey: false
});

collaboratorSchema.pre('save', function (next) {
    //Si on crée/modifie le mot de passe, il est hashé. Sinon rien ne se passe au niveau du hash.
    if (!this.isModified('password')) {
        return next();
    }
    this.password = hash(this.password);
    next();
});

collaboratorSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

collaboratorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

module.exports = Collaborator;