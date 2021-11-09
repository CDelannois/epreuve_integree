const mongoose = require('mongoose');

const functionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Function title required.'],
        unique: true,
    },
    total: {
        type: Number,
        validate: function (totalInput) {
            return totalInput >= 0;
        },
        default: 0,
        required: [true, `Number of collaborator assuming this function required.`],
    },
    enabled: {
        type: Number,
        validate: function (enabledInput) { //La valeur entrée pour enabled est valable si elle est plus petite ou égale à total.
            return enabledInput <= this.total;
        },
        default: 0,
        required: [true, `Number of active collaborator assuming this function required.`],
    },
}, {
    collection: 'functions',
    versionKey: false
});

const Function = mongoose.model('Function', functionSchema);

module.exports = Function;