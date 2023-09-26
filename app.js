const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// import the routes
const routes = require('./routes/routes');

// body parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registering the routes
app.use('/', routes);


module.exports = app;
