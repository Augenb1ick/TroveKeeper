const router = require('express').Router();

const {
    getCurrentUser,
    getAllUsers,
    blockUsers,
    unblockUsers,
    deleteUsers,
    assignAdmin,
    demoteAdmin,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/all', getAllUsers);
router.delete('/', deleteUsers);
router.patch('/block/', blockUsers);
router.patch('/unblock/', unblockUsers);
router.patch('/assign/admin', assignAdmin);
router.patch('/assign/user', demoteAdmin);

module.exports = router;
