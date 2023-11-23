const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const DeniedError = require('../errors/denied-err');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => isEmail(email),
            message: 'Invalid password',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    regDate: {
        type: String,
    },
    lastLogin: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'user',
    },
    authToken: {
        type: String,
        select: false,
    },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email })
        .select('+password')
        .then((user) => {
            if (!user) {
                throw new DeniedError('Invalid email or password');
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    throw new DeniedError('Invalid email or password');
                }
                return user;
            });
        });
};

module.exports = mongoose.model('user', userSchema);
