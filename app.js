const express = require('express');
require('dotenv').config();
require('./config/db/mongoConfig');
const middleware = require('./middlewares/appMiddleware');

const app = express();

middleware(app);

module.exports = app;
