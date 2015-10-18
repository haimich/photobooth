'use strict';

var yaml    = require('js-yaml');
var fs      = require('fs');
var express = require('express');

function readConfig() {
  try {
    return yaml.safeLoad(fs.readFileSync('photobooth-config.yml', 'utf8'));
  } catch (e) {
    throw new Error('Config could not be loaded');
  }
}

var config = readConfig();

var app     = express();
app.use(express.static('static'));

app.get('/search', function (req, res) {
  res.send('Hello World');
});
 
app.listen(3000);