const mysql = require('mysql2/promise');

const conf = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'tenders',
};

let pool;

const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: conf.host,
      user: conf.user,
      password: conf.password,
    });

    const [databases] = await connection.query('SHOW DATABASES');
    const databaseExists = databases.some(db => db.Database === conf.database);

    if (!databaseExists) {
      await connection.query(`CREATE DATABASE ${conf.database}`);
      console.log(`Database "${conf.database}" created.`);
    }

    await connection.query(`USE ${conf.database}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tenders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        institution VARCHAR(255),
        start DATETIME,
        end DATETIME,
        max_budget DECIMAL(10,2)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tender_id INT,
        bidder_name VARCHAR(255),
        offer_value DECIMAL(10,2),
        submitted_at DATETIME,
        FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM tenders');
    if (rows[0].count === 0) {
      await connection.query(`
        INSERT INTO tenders (title, description, institution, start, end, max_budget)
        VALUES 
        ('Dostawa komputerów', 'Zakup 50 komputerów dla szkoły', 'Szkoła nr 1', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 50000.00),
        ('Remont dachu', 'Remont dachu budynku urzędu', 'Urząd Gminy', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 70000.00)
      `);
      console.log('Dodano przykładowe dane.');
    }

    await connection.end();

    pool = mysql.createPool({
      host: conf.host,
      user: conf.user,
      password: conf.password,
      database: conf.database,
    });

    console.log('Połączenie z bazą danych gotowe.');
  } catch (err) {
    console.error('Błąd inicjalizacji bazy:', err);
    throw err;
  }
};

module.exports = {
  initializeDatabase,
  getPool: () => pool,
};
