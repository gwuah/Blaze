const ErrorHandler = require('../services/ErrorHandler');
const bodyParser = require('body-parser');
const routes = require('../routes/api');
const config = require('../config');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config()

const server = express();
// set a port
server.set('port', config.PORT)

// ENABLE CORS
server.use(cors())

// use body parser
server.use(bodyParser.json());

// Use a logger
server.use(logger('dev'));

server.use('/api', routes);

// one main god to handle all errors.
server.use(ErrorHandler());

module.exports = server;

