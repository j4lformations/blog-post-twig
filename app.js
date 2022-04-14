const express = require('express');
const moment = require('moment');
require('dotenv').config();
require('./config/db/mongoConfig');
require('./config/passport/passport');
const middleware = require('./middlewares/appMiddleware');

moment.locale('fr');

const app = express();

middleware(app);

module.exports = app;
