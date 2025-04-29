const Offer = require('../models/Offer');
const Tender = require('../models/Tender');

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
  const offers = await Offer.getByTenderId(req.params.id);

  const validOffers = offers.filter(o => o.offer_value <= tender.max_budget);
  const hasValid = validOffers.length > 0;

  res.render('finishedTenderDetails', {
    tender,
    offers: validOffers,
    noWinner: !hasValid
  });
};
