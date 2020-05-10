var Queue = require('queue-cb');

var exec = require('./lib/exec');
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

    var queue = new Queue(1);
    var platform = options.platform || process.platform;
    if (platform === 'win32') {
      options.silent || console.log('Windows versions not supported yet. Using system version of Node.js');
      queue.defer(exec.bind(null, command, args, options));
    } else {
      for (var index = 0; index < versions.length; index++) {
        queue.defer(exec.bind(null, 'nave', ['use', versions[index], command].concat(args), options));
      }
    }

    queue.await(function (err) {
      err ? callback(err) : callback(null, platform === 'win32' ? 1 : versions.length);
    });
  });
};
