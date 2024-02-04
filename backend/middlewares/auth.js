require('dotenv').config();
const jwt = require('jsonwebtoken');
const DeniedError = require('../errors/denied-err');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new DeniedError('You need to login'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new DeniedError('Invalid token'));
  }

  User.findById(payload)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new DeniedError('User not found'));
      }

      if (user.isBlocked) {
        return next(new DeniedError('The user is blocked'));
      }
      req.user = payload;
      next();
    });
};

module.exports = auth;
