const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const offerController = require('../controllers/offerController');

router.get('/', tenderController.showTenderList);
router.get('/finished', tenderController.showFinishedTenderList);
router.get('/add', tenderController.showAddTender);
router.post('/add', tenderController.createTender);
router.get('/:id', tenderController.showTenderDetails);
router.post('/:id/offer', offerController.submitOffer);
router.get('/:id/offer', offerController.showOfferForm);
router.get('/:id/finished', offerController.showTenderOffers);

module.exports = router;
