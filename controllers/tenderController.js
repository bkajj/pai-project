const Tender = require('../models/Tender');
const Offer = require('../models/Offer');
exports.showHome = (req, res) => {
  res.render('index');
};

function formatDate(date) {
  return new Date(date).toLocaleString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

exports.showTenderList = async (req, res) => {
  try {
    const tenders = await Tender.getActive();
    const formattedTenders = tenders.map(tender => {
      return {
        ...tender,
        start: formatDate(tender.start),
        end: formatDate(tender.end),
      };
    });

    res.render('tenderList', { tenders: formattedTenders });
  } catch (err) {
    console.error('Błąd podczas pobierania przetargów:', err);
    res.status(500).send('Błąd bazy danych');
  }
};

exports.showFinishedTenderList = async (req, res) => {
  const tenders = await Tender.getFinished();
  const formattedTenders = tenders.map(tender => {
    return {
      ...tender,
      start: formatDate(tender.start),
      end: formatDate(tender.end),
    };
  });
  res.render('finishedTenderList', { tenders: formattedTenders });
};

exports.showAddTender = (req, res) => {
  res.render('addTender');
};

exports.createTender = async (req, res) => {
  await Tender.create(req.body);
  res.redirect('/tenders');
};

exports.showTenderDetails = async (req, res) => {
  const tender = await Tender.getById(req.params.id);
  if (!tender) return res.status(404).send('Nie znaleziono przetargu');

  const validOffers = await Offer.getValidOffersForTender(tender.id, tender.max_budget);
  const allOffers = await Offer.getAllOffersForTender(tender.id);

  const hasValidOffers = validOffers.length > 0;

    res.render('details', {
      tender: tender,
      offers: hasValidOffers ? validOffers : allOffers,
      hasValidOffers: hasValidOffers
    });
};

