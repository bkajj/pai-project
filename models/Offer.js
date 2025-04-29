const { getPool } = require('../config/db');

class Offer {
  static async create(tender_id, bidder_name, offer_value) {
    await getPool().query(
      'INSERT INTO offers (tender_id, bidder_name, offer_value, submitted_at) VALUES (?, ?, ?, NOW())',
      [tender_id, bidder_name, offer_value]
    );
  }

  static async getByTenderId(tender_id) {
    const [rows] = await getPool().query(
      'SELECT * FROM offers WHERE tender_id = ? ORDER BY offer_value ASC',
      [tender_id]
    );
    return rows;
  }
}

module.exports = Offer;
