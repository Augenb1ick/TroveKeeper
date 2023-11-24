const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
    },
    isRequired: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    fieldType: {
        type: String,
        required: true,
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collection',
        required: true,
    },
});

module.exports = mongoose.model('field', fieldSchema);
