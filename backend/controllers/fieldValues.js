const FieldValue = require('../models/fieldValue');
const BadRequestError = require('../errors/bad-request-err');
const { default: mongoose } = require('mongoose');
const NotFoundError = require('../errors/not-found-err');
const fieldValue = require('../models/fieldValue');

const createFieldValue = (req, res, next) => {
    const { itemId, fieldId, value } = req.body;

    FieldValue.create({ itemId, fieldId, value })
        .then((fieldValue) => res.send(fieldValue))
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when creating the fieldValue.'
                    )
                );
            }
            return next(err);
        });
};

const getItemFieldValue = (req, res, next) => {
    const { itemId, fieldId } = req.params;

    FieldValue.find({ itemId, fieldId })
        .then((fieldValues) => {
            if (!fieldValues) {
                throw new NotFoundError(
                    'Field values for collection with the specified id were not found.'
                );
            }

            const value = fieldValues.map((fieldValue) => fieldValue.value);
            if (!value) return;
            return res.send(value);
        })
        .catch(next);
};

const updateFieldValue = (req, res, next) => {
    const { itemId, fieldId, newValue } = req.body;

    return FieldValue.findOneAndUpdate(
        { itemId, fieldId },
        { value: newValue },
        {
            runValidators: true,
            new: true,
        }
    )
        .then((fieldValue) => {
            res.send(fieldValue);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when updating FieldValue.'
                    )
                );
            }
            return next(err);
        });
};

const deleteFieldValue = (req, res, next) => {
    const { itemId, fieldId } = req.body;

    FieldValue.deleteOne({
        itemId,
        fieldId,
    })
        .then(() => {
            res.send({ message: 'FieldValue deleted' });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Incorrect data was passed when deleting FieldValue.'
                    )
                );
            }
            return next(err);
        });
};

module.exports = {
    createFieldValue,
    getItemFieldValue,
    deleteFieldValue,
    updateFieldValue,
};
