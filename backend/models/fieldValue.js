const mongoose = require('mongoose');

const fieldValueSchema = new mongoose.Schema({
    value: {
        type: String,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
        required: true,
    },
    fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'field',
        required: true,
    },
});

module.exports = mongoose.model('fieldValue', fieldValueSchema);
