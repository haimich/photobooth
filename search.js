var config = require('./config');
var https = require('https');

var config = config.readConfig();

module.exports = function(term, callback) {
  var url = config.flickr.url + "?method=flickr.photos.search&api_key=" + config.flickr.api_key + "&text=" + term + "&format=json&nojsoncallback=1&perpage=10";

  https.get(url, function(res) {
    if (res.statusCode !== 200) {
      throw new Error('Search request failed with status code ' + res.statusCode);
    }    

    res.on('data', function(data) {
      callback(data);
    });

  }).on('error', function(e) {
    throw new Error('Search request failed');
  });
};