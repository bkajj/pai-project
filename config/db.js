const mysql = require('mysql2');

// database configuration
const conf =  {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'tenders',
}

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
});

const initializeDatabase = async () => {
  try {
    const [databases] = await connection.promise().query('SHOW DATABASES');
    const databaseExists = databases.some(db => db.Database === 'tenders');
    
    if (!databaseExists) {
      await connection.promise().query('CREATE DATABASE tenders');
      console.log('Database "tenders" created.');
    }
    
    connection.changeUser({ database: 'tenders' }, (err) => {
      if (err) {
        console.error('Error connecting to the "tenders" database: ', err);
        throw err;
      }
      console.log('Connected to the "tenders" database.');
    });
  } catch (err) {
    console.error('Error initializing the database: ', err);
    throw err;
  }
};

const pool = mysql.createPool({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.database,
});

module.exports = { pool, initializeDatabase };
