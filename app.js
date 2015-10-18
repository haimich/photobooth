var search  = require('./search');
var config  = require('./config');
var express = require('express');

var app = express();
app.use(express.static('static'));

app.get('/search', function (req, res) {
  var term = req.query.term || '';

  if (term === '') {
    res.end('Error: no term given');
  } else {
    try {
      search(term, function(response) {
        res.end(response);
      });
    } catch (error) {
      res.end(error);
    }
  }
});
 
app.listen(3000);