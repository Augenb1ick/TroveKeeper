const mongoose = require('mongoose');
const fieldSchema = require('../models/field');
const { isURL } = require('validator');
const SAMPLE_POSTER_IMG = require('../utills/constants');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
        validate: {
            validator: (poster) => isURL(poster),
            message: 'Invalid poster link',
        },
        default: SAMPLE_POSTER_IMG,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        default: [],
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collection',
        required: true,
    },
    collectionName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('item', itemSchema);
