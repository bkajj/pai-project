const express = require('express');
const app = express();
const path = require('path');
const tenderRoutes = require('./routes/tenderRoutes');
const { initializeDatabase } = require('./config/db.js');

initializeDatabase();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/tenders', tenderRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
