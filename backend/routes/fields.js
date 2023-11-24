const { createField } = require('../controllers/fields');
const { changeItemName } = require('../controllers/items');

const router = require('express').Router();

router.post('/create', createField);
router.patch('/update/name', changeItemName);

module.exports = router;
