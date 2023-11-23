require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');
const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const currentDate = format(new Date(), 'dd.MM.yyyy');

const createUser = (req, res, next) => {
    const { name, email, password } = req.body;

    bcrypt
        .hash(password, 10)
        .then((hash) =>
            User.create({
                name,
                email,
                password: hash,
                regDate: currentDate,
            })
        )
        .then((newUser) => {
            const user = newUser.toObject();
            delete user.password;
            return res.send(user);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                return next(
                    new BadRequestError(
                        'Invalid data provided for user creation.'
                    )
                );
            }
            if (err.code === 11000) {
                return next(
                    new ConflictError('User with this email already exists')
                );
            }
            return next(err);
        });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    User.findUserByCredentials(email, password)
        .then((user) => {
            if (user.isBlocked) {
                throw new ForbiddenError('The user is blocked');
            }

            const token = jwt.sign(
                { _id: user._id },
                NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
                { expiresIn: '7d' }
            );

            const updateFields = {
                authToken: token,
                lastLogin: currentDate,
            };

            const query = { email };

            return User.updateOne(query, updateFields).then(() =>
                res.send({ token })
            );
        })
        .catch(next);
};

const getCurrentUser = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => res.send(user))
        .catch(next);
};

const getAllUsers = (req, res, next) => {
    User.find()
        .then((users) => res.send(users))
        .catch(next);
};

const deleteUsers = (req, res, next) => {
    // eslint-disable-next-line prefer-destructuring
    const userIds = req.body.userIds;

    const deletePromises = userIds.map((userId) =>
        User.findOneAndDelete({ _id: userId })
    );

    Promise.all(deletePromises)
        .then(() => res.send({ message: 'Users deleted successfully.' }))
        .catch((err) => next(err));
};

const updateUsers = (userIds, updateFields, res, message, next) => {
    const updatePromises = userIds.map((userId) =>
        User.updateOne({ _id: userId }, updateFields)
    );

    Promise.all(updatePromises)
        .then(() => res.send({ message }))
        .catch((err) => next(err));
};

const changeUserRole = (req, res, next, role) => {
    const userIds = req.body.userIds;
    const updateFields = { role };

    updateUsers(
        userIds,
        updateFields,
        res,
        `Users assigned as ${role}s successfully.`,
        next
    );
};

const changeUsersBlockStatus = (req, res, next, isBlocked) => {
    const userIds = req.body.userIds;
    const updateFields = { isBlocked };

    updateUsers(
        userIds,
        updateFields,
        res,
        `Users ${isBlocked ? 'blocked' : 'unblocked'} successfully.`,
        next
    );
};

const assignAdmin = (req, res, next) => {
    changeUserRole(req, res, next, 'admin');
};

const demoteAdmin = (req, res, next) => {
    changeUserRole(req, res, next, 'user');
};

const blockUsers = (req, res, next) => {
    changeUsersBlockStatus(req, res, next, true);
};

const unblockUsers = (req, res, next) => {
    changeUsersBlockStatus(req, res, next, false);
};

module.exports = {
    createUser,
    login,
    getCurrentUser,
    getAllUsers,
    deleteUsers,
    blockUsers,
    unblockUsers,
    assignAdmin,
    demoteAdmin,
};
