const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');

router.get('/', tenderController.getAllTenders);
router.post('/', tenderController.createTender);

module.exports = router;
