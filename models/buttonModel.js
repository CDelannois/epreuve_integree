const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Button name required'],
    },
    tts: {
        type: String,
        require: [true, 'Text to speech required']
    },
    key: {
        type: Number,
        required: [true, 'Button key required'],
        unique: true
    },
});

const Button = mongoose.model('Button', buttonSchema);

module.exports = Button;