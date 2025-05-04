const Offer = require('../models/Offer');
const Tender = require('../models/Tender');
const tenderController = require('../controllers/tenderController');

exports.submitOffer = async (req, res) => {
  const tender = await Tender.getById(req.params.id);

  const now = new Date();
  const endDate = new Date(tender.end);
  if (now > endDate) {
    return res.status(400).send('Przetarg zakończony');
  }

  await Offer.create(req.params.id, req.body.bidder_name, req.body.offer_value);
  res.redirect(`/tenders/${req.params.id}`);
};

exports.showTenderOffers = async (req, res) => {
  const tender = await Tender.getById(req.params.id);
  const formattedStart = await tenderController.formatDate(tender.start);
  const formattedEnd = await tenderController.formatDate(tender.end);
  const offers = await Offer.getByTenderId(req.params.id);

  const validOffers = offers.filter(o => o.offer_value <= formattedTender.max_budget);
  const hasValid = validOffers.length > 0;

  res.render('finishedTenderDetails', {
    tender,
    start: formattedStart,
    end: formattedEnd,
    offers: validOffers,
    noWinner: !hasValid
  });
};

exports.showOfferForm = async (req, res) => {
    const tender = await Tender.getById(req.params.id);
    if (!tender) return res.status(404).send('Nie znaleziono przetargu');
  
    res.render('tenders/offerForm', { tender });
  };