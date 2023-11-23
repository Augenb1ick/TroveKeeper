const {
    createFieldValue,
    deleteFieldValue,
    updateFieldValue,
} = require('../controllers/fieldValues');

const router = require('express').Router();

router.post('/create', createFieldValue);
router.delete('/delete', deleteFieldValue);
router.patch('/update', updateFieldValue);

module.exports = router;
