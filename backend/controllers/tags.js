const Tag = require('../models/tag');
const BadRequestError = require('../errors/bad-request-err');
const { default: mongoose } = require('mongoose');

const createTags = (req, res, next) => {
    const { itemId, tags } = req.body;

    const tagPromises = tags.map((tagData) => {
        const { name } = tagData;
        return Tag.create({ name, items: [itemId] });
    });

    Promise.all(tagPromises)
        .then((createdTags) => {
            res.send(createdTags);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when creating tags.'
                    )
                );
            }
            return next(err);
        });
};

const addItemsToTag = (req, res, next) => {
    const { tags, itemId } = req.body;
    const tagPromises = tags.map((tagData) => {
        const { name } = tagData;
        return Tag.findOneAndUpdate({ name }, { $addToSet: { items: itemId } });
    });

    Promise.all(tagPromises)
        .then(() => {
            res.send({ message: 'Tags updated' });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when updating tags.'
                    )
                );
            }
            return next(err);
        });
};

const deleteItemsFromTags = (req, res, next) => {
    const { itemId, tags } = req.body;

    const tagPromises = tags.map((tagData) => {
        const { name } = tagData;
        return Tag.findOneAndUpdate(
            { name },
            {
                $pull: { items: { $in: [itemId] } },
            },
            { new: true }
        ).then((updatedTag) => {
            if (updatedTag.items.length === 0) {
                return Tag.findOneAndDelete({ name });
            }
        });
    });

    Promise.all(tagPromises)
        .then(() => {
            res.send({ message: 'Tags updated' });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when updating tags.'
                    )
                );
            }
            return next(err);
        });
};

const getItemTags = (req, res, next) => {
    const { id } = req.params;

    Tag.find({ items: { $in: [id] } })
        .then((tags) => {
            if (!tags) {
                throw new NotFoundError(
                    'Tags for item with the specified id were not found.'
                );
            }
            return res.send(tags);
        })
        .catch(next);
};

const getAllTags = (req, res, next) => {
    Tag.find()
        .then((tags) => {
            res.send(tags);
        })
        .catch(next);
};

module.exports = {
    createTags,
    getItemTags,
    getAllTags,
    deleteItemsFromTags,
    addItemsToTag,
};
