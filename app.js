var search  = require('./search');
var share   = require('./share');
var upload  = require('./upload');
var config  = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());

/* Flickr Search */
app.get('/search', function (req, res) {
  var term = req.query.term || '';

  if (term === '') {
    res.end('Error: no term given');
  } else {
    try {
      var dataReceived = function (data) { res.write(data); };
      var end = function() { res.end(); };

      search(term, dataReceived, end);
    } catch (error) {
      res.end(error);
    }
  }
});

/* Image Upload */
app.post('/upload', function(req, res) {
  imageAsBase64 = req.body.image;
  
  upload('photos/maxresdefault.jpg', function(uploadedFileName) {
    share(uploadedFileName);
  });

  res.json({ success: true });
});

app.listen(3000);