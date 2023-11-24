const router = require('express').Router();

const {
    getUsersCollections,
    createCollection,
    changeCollectionName,
    changeCollectionDescription,
    changeCollectionCategory,
    changeCollectionVisability,
    changeCollectionPoster,
    addItemToCollection,
    deleteItemsFromCollection,
    deleteCollection,
} = require('../controllers/collections');

router.get('/my', getUsersCollections);
router.post('/create', createCollection);
router.patch('/update/name', changeCollectionName);
router.patch('/update/description', changeCollectionDescription);
router.patch('/update/category', changeCollectionCategory);
router.patch('/update/poster', changeCollectionPoster);
router.patch('/change/visability', changeCollectionVisability);
router.patch('/add-item', addItemToCollection);
router.patch('/delete-items', deleteItemsFromCollection);
router.delete('/delete', deleteCollection);

module.exports = router;
