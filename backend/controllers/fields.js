const Field = require('../models/field');
const httpConstants = require('http2').constants;
const BadRequestError = require('../errors/bad-request-err');
const { default: mongoose } = require('mongoose');
const NotFoundError = require('../errors/not-found-err');

const createField = (req, res, next) => {
    const { collectionId, name, isRequired, fieldType } = req.body;

    Field.create({
        name,
        isRequired,
        fieldType,
        collectionId,
    })
        .then((field) => res.send(field))
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when creating the field.'
                    )
                );
            }
            return next(err);
        });
};

const getCollectionFields = (req, res, next) => {
    const { id } = req.params;

    Field.find({ collectionId: id })
        .then((fields) => {
            if (!fields) {
                throw new NotFoundError(
                    'Fields for collection with the specified id were not found.'
                );
            }
            return res.send(fields);
        })
        .catch(next);
};

module.exports = { getCollectionFields, createField };
