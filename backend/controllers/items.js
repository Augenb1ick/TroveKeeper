const Item = require('../models/item');
const BadRequestError = require('../errors/bad-request-err');
const { default: mongoose } = require('mongoose');

const createItem = (req, res, next) => {
    const { name, collectionId, ownerName, collectionName } = req.body;

    Item.create({ name, collectionId, ownerName, collectionName })
        .then((item) => res.send(item))
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when creating the item.'
                    )
                );
            }
            return next(err);
        });
};

const getCollectionItems = (req, res, next) => {
    const { id } = req.params;

    Item.find({ collectionId: id })
        .then((items) => {
            if (!items) {
                throw new NotFoundError(
                    'items for collection with the specified id were not found.'
                );
            }
            return res.send(items);
        })
        .catch(next);
};

const changeItemName = (req, res, next) => {
    const { newName, itemId } = req.body;

    Item.findByIdAndUpdate(
        { _id: itemId },
        { name: newName },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError(
                    'The item with the specified id was not found.'
                );
            }
            return res.send(item);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when changing item`s name.'
                    )
                );
            }
            return next(err);
        });
};

const changeItemPoster = (req, res, next) => {
    const { newPoster, itemId } = req.body;

    Item.findByIdAndUpdate(
        { _id: itemId },
        { poster: newPoster },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError(
                    'The item with the specified id was not found.'
                );
            }
            return res.send(item);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when changing item`s name.'
                    )
                );
            }
            return next(err);
        });
};

const deleteItems = (req, res, next) => {
    const { items } = req.body;

    const itemPromises = items.map((item) => {
        return Item.deleteOne({ _id: item });
    });

    Promise.all(itemPromises)
        .then(() => {
            res.send({ message: 'Items deleted' });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when deleting items.'
                    )
                );
            }
            return next(err);
        });
};

const getItemInfo = (req, res, next) => {
    const { id } = req.params;
    Item.find({ _id: id })
        .then((item) => {
            if (!item) {
                throw new NotFoundError(
                    'items for specified id were not found.'
                );
            }
            return res.send(item);
        })
        .catch(next);
};

const getAllItems = (req, res, next) => {
    Item.find()
        .then((items) => {
            res.send(items);
        })
        .catch(next);
};

const likeItem = (req, res, next) => {
    Item.findByIdAndUpdate(
        { _id: req.params.id },
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError('A non-existent card _id was passed.');
            }
            return res.send(item);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
                return next(
                    new BadRequestError(
                        'Incorrect data for was sent to like item.'
                    )
                );
            }
            return next(err);
        });
};

const dislikeItem = (req, res, next) => {
    Item.findByIdAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError('A non-existent card _id was passed.');
            }
            return res.send(item);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
                return next(
                    new BadRequestError(
                        'Incorrect data for was sent to dislike item.'
                    )
                );
            }
            return next(err);
        });
};

const searchItemsByQuery = (req, res, next) => {
    const { query } = req.params;
    Item.find({
        $or: [
            { collectionName: { $regex: query, $options: 'i' } },
            { ownerName: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
        ],
    })
        .then((items) => {
            if (!items) {
                return res.send({ message: 'No items were found' });
            }
            return res.send(items);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
                return next(
                    new BadRequestError(
                        'Incorrect data for was sent to find items.'
                    )
                );
            }
            return next(err);
        });
};

module.exports = {
    createItem,
    changeItemName,
    getCollectionItems,
    deleteItems,
    getItemInfo,
    getAllItems,
    changeItemPoster,
    likeItem,
    dislikeItem,
    searchItemsByQuery,
};
