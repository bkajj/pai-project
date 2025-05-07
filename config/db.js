const mysql = require('mysql2/promise');

const conf = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'tenders',
};

let pool;

const initializeDatabase = async (testEnv) => {
  try {
    const connection = await mysql.createConnection({
      host: conf.host,
      user: conf.user,
      password: conf.password,
    });

    if (testEnv) {
      console.log(`!!!Srodowisko testowe!!!`);
      conf.database += '_test';
    }

    const [databases] = await connection.query('SHOW DATABASES');
    const databaseExists = databases.some(db => db.Database === conf.database);

    if (testEnv) {
      await connection.query(`DROP DATABASE IF EXISTS ${conf.database}`);
      console.log(`Usunięto bazę danych "${conf.database}".`);
    }
    
    if (!databaseExists || testEnv) {
      await connection.query(`CREATE DATABASE ${conf.database}`);
      console.log(`Utworzono bazę danych "${conf.database}".`);

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
          ('Remont dachu', 'Remont dachu budynku urzędu', 'Urząd Gminy', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 70000.00),
          ('Budowa parkingu', 'Nowy parking przy szpitalu', 'Szpital Miejski', NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 150000.00),
          ('Dostawa sprzętu biurowego', 'Zakup drukarek i skanerów', 'Urząd Skarbowy', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 30000.00),
          
          ('Modernizacja oświetlenia', 'Wymiana latarni w mieście', 'Zarząd Dróg', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 100000.00),
          ('Renowacja zabytków', 'Renowacja pomnika w parku', 'Muzeum Narodowe', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 50000.00),
          ('Wywóz odpadów', 'Umowa na wywóz odpadów z gminy', 'Gmina Zielone', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 80000.00)
        `);
        console.log('Dodano przykładowe dane.');
      }
  
      const [tenders] = await connection.query('SELECT id FROM tenders');
  
      const offers = [];
      for (const tender of tenders) {
        offers.push([
          tender.id, 'Poltrex', (Math.random() * 0.9 + 0.1).toFixed(2) * 100000, new Date()
        ]);
        offers.push([
          tender.id, 'Betlonic', (Math.random() * 0.9 + 0.1).toFixed(2) * 100000, new Date()
        ]);
        if (Math.random() > 0.5) {
          offers.push([
            tender.id, 'Gamma', (Math.random() * 0.9 + 0.1).toFixed(2) * 100000, new Date()
          ]);
        }
      }
  
      for (const [tender_id, bidder_name, offer_value, submitted_at] of offers) {
        await connection.query(`
          INSERT INTO offers (tender_id, bidder_name, offer_value, submitted_at)
          VALUES (?, ?, ?, ?)
        `, [tender_id, bidder_name, offer_value, submitted_at]);
      }
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
