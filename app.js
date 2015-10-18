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
  var rawImage = imageAsBase64.replace(/^data:image\/jpeg;base64,/, '');

  var filename = 'photos/photo_' + new Date().getTime() + '.jpg';
  
  require('fs').writeFile(filename, rawImage, 'base64', function(err) {
    if (err !== null && err !== '') {
      throw new Error('Writing file with name ' + filename + ' failed!');
    }
  });
  
  upload(filename, function(uploadedFileName) {
    share(uploadedFileName);
  });

  res.json({ success: true });
});

app.listen(3000);