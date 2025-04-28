const tenderModel = require('../models/Tender');

const getAllTenders = async (req, res) => {
  try {
    const [tenders] = await tenderModel.getTenders();
    res.render('index', { tenders }); 
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const createTender = async (req, res) => {
  const { name, description, start, end, maxValue } = req.body;
  try {
    await tenderModel.addTender(name, description, start, end, maxValue);
    res.redirect('/tenders');
  } catch (err) {
    res.status(500).send('Error while adding tender');
  }
};

module.exports = { getAllTenders, createTender };
