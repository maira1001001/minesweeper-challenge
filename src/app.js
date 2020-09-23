/** @format */
const path = require('path');
const express = require('express');

const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/dev', routes);

var fileServer = express.static(path.join(__dirname, '/public'));
app.use(fileServer);

module.exports = app;
