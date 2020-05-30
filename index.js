var assign = require('object-assign');

var useVersions = require('./lib/useVersions');

var DEFAULT_OPTIONS = {
  range: 'major,even',
};

module.exports = function nvs(versionExpression, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return useVersions(versionExpression, command, args, assign({}, DEFAULT_OPTIONS, options), callback);
  return new Promise(function (resolve, reject) {
    nvs(versionExpression, command, args, options, function nvsCallback(err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};
