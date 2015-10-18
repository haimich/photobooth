var yaml    = require('js-yaml');
var fs      = require('fs');

module.exports.readConfig = function() {
  try {
    return yaml.safeLoad(fs.readFileSync('photobooth-config.yml', 'utf8'));
  } catch (e) {
    throw new Error('Config could not be loaded');
  }
};