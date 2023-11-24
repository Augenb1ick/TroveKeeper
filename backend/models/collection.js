const mongoose = require('mongoose');
const { isURL } = require('validator');
const SAMPLE_POSTER_IMG = require('../utills/constants');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
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
    category: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'item',
        default: [],
    },
});

module.exports = mongoose.model('collection', collectionSchema);
