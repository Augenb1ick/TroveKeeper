const router = require('express').Router();
const {
    getAllCollections,
    getCollectionById,
} = require('../controllers/collections');
const { getItemFieldValue } = require('../controllers/fieldValues');
const { getCollectionFields } = require('../controllers/fields');
const {
    getCollectionItems,
    getItemInfo,
    getAllItems,
    searchItemsByQuery,
} = require('../controllers/items');
const { getItemTags, getAllTags } = require('../controllers/tags');
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');
const authRoutes = require('./auth');

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('server will now fall');
//   }, 0);
// });

router.use(authRoutes);

router.get('/collections/all', getAllCollections);
router.get('/collections/id/:id', getCollectionById);
router.get('/fields/all/:id', getCollectionFields);
router.get('/items/search/:query', searchItemsByQuery);
router.get('/items/collection/:id', getCollectionItems);
router.get('/items/all/', getAllItems);
router.get('/items/info/:id', getItemInfo);
router.get('/tags/all', getAllTags);
router.get('/tags/all/:id', getItemTags);
router.get('/field-values/all/:itemId/:fieldId', getItemFieldValue);

router.use(auth);

router.use('/users', require('./users'));
router.use('/collections', require('./collections'));
router.use('/fields', require('./fields'));
router.use('/field-values', require('./fieldValues'));
router.use('/items', require('./items'));
router.use('/tags', require('./tags'));

router.use('/*', (req, res, next) =>
    next(new NotFoundError('Route does not exist.'))
);

module.exports = router;
