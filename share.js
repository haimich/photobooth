var config = require('./config');
var https = require('https');

var config = config.readConfig();

module.exports = function(imageLink) {
  var user = config.one.user;
  var pw = config.one.pw;

  var post_data = '{"body": "### Photobooth has striked again!\n\n![photobooth](' + imageLink + ')", "wall_id": ' + config.one.shoutout_wall + '}';

  var options = {
    host: config.one.host,
    port: 443,
    path: config.one.api_path_share,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    },
    auth: user + ':' + pw
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');

    if (res.statusCode !== 201) {
      throw new Error('ONE request failed with status code ' + res.statusCode);
    } else {
      console.log('Shared successfully');
    }

    res.on('end', function() {
      console.log('end');
    });
  });

  req.write(post_data);
  req.end();

  req.on('error', function(e) {
    throw new Error('ONE request failed', e);
  });
};