var nvu = require('node-version-use');
var Queue = require('queue-cb');

var resolveVersions = require('./lib/resolveVersions');

module.exports = function nvs(command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  resolveVersions(options, function (err, versions) {
    if (err) return callback(err);
    if (!versions.length) return callback(new Error('No versions provided'));

    var res = typeof options.stdout === 'string' ? { stdout: '', count: 0 } : { count: 0 };
    var queue = new Queue(1);
    for (var index = 0; index < versions.length; index++) {
      var version = versions[index];
      queue.defer(function (callback) {
        console.log('----------------------');
        console.log(version);
        console.log('----------------------');

        nvu(version, command, args, options, function (err, _res) {
          if (err || _res.code !== 0) return callback(err || new Error('Failed to use version: ' + version.version + '. Code: ' + _res.code));
          if (typeof options.stdout === 'string') res.stdout += _res.stdout;
          res.count++;
          callback();
        });
      });
    }
    queue.await(function (err) {
      err ? callback(err) : callback(null, res);
    });
  });
};
