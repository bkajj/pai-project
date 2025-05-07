const { getPool } = require('../config/db');

let currentTime = new Date();

function setCurrentTime(newTime) {
  console.log('[DEBUG] setCurrentTime:', newTime); // dodaj to
  currentTime = newTime;
}

function getCurrentTime() {
  return currentTime;
}

class Tender {
  static async getAll() {
    const [rows] = await getPool().query('SELECT * FROM tenders');
    return rows;
  }

  static async getById(id) {
    const [rows] = await getPool().query('SELECT * FROM tenders WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { title, description, institution, start, end, max_budget } = data;
    await getPool().query(
      'INSERT INTO tenders (title, description, institution, start, end, max_budget) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, institution, start, end, max_budget]
    );
  }

  static async getFinished() {
    const [rows] = await getPool().query('SELECT * FROM tenders WHERE end < ?', [getCurrentTime()]);
    return rows;
  }

  static async getActive() {
    const [rows] = await getPool().query('SELECT * FROM tenders WHERE end > ?', [getCurrentTime()]);
    return rows;
  }
}

module.exports = {Tender, setCurrentTime, getCurrentTime};
