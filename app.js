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
      var dataReceived = function (data) { res.write(data); };
      var end          = function() { 
        res.end();
      };

      search(term, dataReceived, end);
    } catch (error) {
      res.end(error);
    }
  }
});
 
app.listen(3000);