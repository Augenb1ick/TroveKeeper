const {
    createItem,
    changeItemName,
    deleteItems,
    changeItemPoster,
    likeItem,
    dislikeItem,
} = require('../controllers/items');

const router = require('express').Router();

router.post('/create', createItem);
router.patch('/update/name', changeItemName);
router.patch('/update/poster', changeItemPoster);
router.put('/likes/:id', likeItem);
router.delete('/likes/:id', dislikeItem);
router.delete('/delete', deleteItems);

module.exports = router;
