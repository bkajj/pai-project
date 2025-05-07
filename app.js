const express = require('express');
const app = express();
const path = require('path');
const tenderRoutes = require('./routes/tenderRoutes');
const { initializeDatabase } = require('./config/db');
const args = process.argv.slice(2);

if(args.length > 0 && args[0] === 'test')
  initializeDatabase(true);
else
  initializeDatabase(false);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.render('index'));
app.use('/tenders', tenderRoutes);

if (args.length > 0 && args[0] === 'test') {
  const { setCurrentTime } = require('./models/Tender');

  app.post('/__test/set-time', (req, res) => {
    const newTime = new Date(req.body.time);
    setCurrentTime(newTime);
    res.sendStatus(204);
  });
}

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
