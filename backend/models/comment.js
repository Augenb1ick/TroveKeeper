const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'item',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('comment', commentSchema);
