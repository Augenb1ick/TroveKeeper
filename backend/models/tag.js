const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'item',
        required: true,
    },
});

module.exports = mongoose.model('tag', tagSchema);
