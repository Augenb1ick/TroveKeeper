const router = require('express').Router();
const { signupValidation, signinValidation } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

module.exports = router;
