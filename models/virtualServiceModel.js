const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const virtualServiceSchema = new mongoose.Schema({
    key: {
        type: Number,
        required: [true, 'Service key required.'],
        unique: true,
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
    services: {
        type: [ObjectId],
        required: [() => {
            return this.virtual === true;
        },
            'Services ID required'],
    },
});


const VirtualService = mongoose.model('VirtualService', virtualServiceSchema);

module.exports = VirtualService;
