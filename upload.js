var config = require('./config');
var exec = require('child_process').exec;

var config = config.readConfig();

module.exports = function(filename, dataReceived) {
  var user = config.one.user;
  var pw = config.one.pw;
  var url = 'https://' + user + ':' + pw + '@' + config.one.host + config.one.api_path_upload;

  //Upload file to ONE via curl due to it's good multipart/form-data capabilites
  var child = exec('curl -F "file[0]=@' + filename + ';type=image/jpg" ' + url,
    function (error, stdout, stderr) {
      if (error !== null && error !== '') {
        throw new Error('An error occured while uploading file ' + filename + ': ' + error);
      }
      
      var regex = /\[ \"(.*)\" \]/
      var result = stdout.match(regex);
      var uploadedFileName = result[1].replace(/\\/g, '');
      dataReceived(uploadedFileName);
  });
};