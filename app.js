const express = require('express');
require('dotenv').config();
const middleware = require('./middlewares/appMiddleware');

const app = express();

middleware(app);

module.exports = app;
