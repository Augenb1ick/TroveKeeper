const Collection = require('../models/collection');
const Item = require('../models/item');
const Tag = require('../models/tag');
const httpConstants = require('http2').constants;
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const { default: mongoose } = require('mongoose');
const SAMPLE_POSTER_IMG = require('../utills/constants');
const { deleteItems } = require('./items');

const createCollection = (req, res, next) => {
    const { name, description, category, poster } = req.body;
    const owner = req.user._id;

    Collection.create({
        name,
        description,
        category,
        poster: poster ? poster : SAMPLE_POSTER_IMG,
        owner,
    })
        .then((collection) => res.send(collection))
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when creating the collection.'
                    )
                );
            }
            return next(err);
        });
};

const updateCollection = (req, res, next) => {
    const { _id, field, value } = req.body;
    const owner = req.user._id;
    const update = { [field]: value };

    Collection.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
    })
        .then((collection) => {
            if (!collection) {
                throw new NotFoundError(
                    'The collection with the specified id was not found.'
                );
            }
            return res.send(collection);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when updating the collection.'
                    )
                );
            }
            return next(err);
        });
};

const changeCollectionName = (req, res, next) => {
    updateCollection(req, res, next, 'name');
};

const changeCollectionDescription = (req, res, next) => {
    updateCollection(req, res, next, 'description');
};

const changeCollectionCategory = (req, res, next) => {
    updateCollection(req, res, next, 'category');
};

const changeCollectionPoster = (req, res, next) => {
    updateCollection(req, res, next, 'poster');
};

const changeCollectionVisability = (req, res, next) => {
    updateCollection(req, res, next, 'isActive');
};

const deleteCollection = async (req, res, next) => {
    try {
        const { _id } = req.body;

        const itemsToDelete = await Collection.findById(_id);
        const itemIds = itemsToDelete.items;

        const tagsToDeleteFrom = await Tag.find({ items: { $in: itemIds } });
        const tagPromises = tagsToDeleteFrom.map((tag) => {
            return Tag.findOneAndUpdate(
                { _id: tag._id },
                { $pull: { items: { $in: itemIds } } },
                { new: true }
            ).then((updatedTag) => {
                if (updatedTag.items.length === 0) {
                    return Tag.findOneAndDelete({ _id: updatedTag._id });
                }
            });
        });

        await Promise.all(tagPromises);
        await Collection.findByIdAndDelete(_id);
        await Item.deleteMany({ collectionId: _id });

        res.send({ message: 'Collection deleted' });
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            return next(
                new BadRequestError('Incorrect data when deleting collection')
            );
        }
        return next(err);
    }
};

const getAllCollections = (req, res, next) => {
    Collection.find()
        .then((collections) => {
            res.send(collections);
        })
        .catch(next);
};

const getUsersCollections = (req, res, next) => {
    const owner = req.user._id;

    Collection.find({ owner })
        .then((collections) => res.send(collections))
        .catch(next);
};

const getCollectionById = (req, res, next) => {
    const { id } = req.params;
    Collection.findById(id)
        .then((collection) => {
            if (!collection) {
                throw new NotFoundError(
                    'The collection with the specified id was not found.'
                );
            }
            return res.send(collection);
        })
        .catch((err) => {
            return next(err);
        });
};

const addItemToCollection = (req, res, next) => {
    const { _id, itemId } = req.body;

    Collection.findByIdAndUpdate(
        _id,
        { $addToSet: { items: itemId } },
        { new: true }
    )
        .then((collection) => {
            if (!collection) {
                throw new NotFoundError(
                    'The collection with the specified id was not found.'
                );
            }
            return res.send(collection);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when updating the collection.'
                    )
                );
            }
            return next(err);
        });
};

const deleteItemsFromCollection = (req, res, next) => {
    const { itemsTobeDeleted, _id } = req.body;

    Collection.findByIdAndUpdate(
        _id,
        { $pull: { items: { $in: itemsTobeDeleted } } },
        { new: true }
    )
        .then(() => {
            res.send({ message: 'Items deleted from collection' });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when deleting items from collection.'
                    )
                );
            }
            return next(err);
        });
};

module.exports = {
    createCollection,
    changeCollectionName,
    changeCollectionDescription,
    changeCollectionCategory,
    changeCollectionPoster,
    changeCollectionVisability,
    getAllCollections,
    getUsersCollections,
    getCollectionById,
    addItemToCollection,
    deleteItemsFromCollection,
    deleteCollection,
};
