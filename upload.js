var config = require('./config');
var https = require('https');
var restler = require('restler');

var config = config.readConfig();

module.exports = function(imageAsBase64, dataReceived, end) {
  var user = config.one.user;
  var pw = config.one.pw;

  restler.post('https:///one/api/files?groupId=21425193', {
    multipart: true,
    username: user,
    password: pw,
    data: {
      'file[0]': restler.file('maxresdefault.jpg', null, 321567, null, 'image/jpeg')
    }
  }).on('complete', function(data) {
    console.log(data);
  }).on('error', function(data) {
    console.log(data);
  });

  console.log('been here');

  // var post_data = '-----------------------------171152142821446724782144806498\nContent-Disposition: form-data; name="file[0]"; filename="maxresdefault.jpg"\nContent-Type: image/jpeg\n\nÿØÿà\n\n-----------------------------171152142821446724782144806498--';

  // var options = {
  //   host: config.one.host,
  //   port: 443,
  //   path: config.one.api_path_upload,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'multipart/form-data; boundary=---------------------------171152142821446724782144806498'
  //     //'Accept': 'application/json'
  //     //'Content-Length': 39749 //Buffer.byteLength(post_data)
  //   },
  //   auth: user + ':' + pw
  // };

  // var req = https.request(options, function(res) {
  //   res.setEncoding('utf8');

  //   console.log(res);

  //   if (res.statusCode !== 201) {
  //     throw new Error('ONE request failed with status code ' + res.statusCode);
  //   } else {
  //     console.log('success');
  //   }

  //   res.on('end', function() {
  //     console.log('end');
  //   });
  // });

  // // req.write(post_data);
  // req.end();

  // req.on('error', function(e) {
  //   throw new Error('ONE request failed', e);
  // });
};