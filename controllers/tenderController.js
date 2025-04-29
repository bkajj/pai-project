const Tender = require('../models/Tender');

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
    const tenders = await Tender.getAll();
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
  res.render('tenderDetails', { tender });
};
