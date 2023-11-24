const {
    createTags,
    deleteItemsFromTags,
    addItemsToTag,
} = require('../controllers/tags');

const router = require('express').Router();

router.post('/create', createTags);
router.patch('/add-items', addItemsToTag);
router.patch('/delete-items', deleteItemsFromTags);

module.exports = router;
