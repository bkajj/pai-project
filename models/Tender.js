const { pool } = require('../config/db.js');

const getTenders = () => {
  return pool.promise().query('SELECT * FROM tenders');
};

const addTender = (name, description, start, end, maxValue) => {
  return pool.promise().execute(
    'INSERT INTO tenders (name, description, start, end, max_value) VALUES (?, ?, ?, ?, ?)', 
    [name, description, start, end, maxValue]
  );
};

module.exports = { getTenders, addTender };
