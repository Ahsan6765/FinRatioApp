
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config/appConfig');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static public folder
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Routes
const indexRouter = require('./routes/indexRoutes');
const apiRouter = require('./routes/apiRoutes');

app.use('/', indexRouter);
app.use('/api', apiRouter);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`FinRatios server running on http://localhost:${PORT}`);
});
