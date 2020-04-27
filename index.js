var Queue = require('queue-cb');

var exec = require('./lib/exec');
var invalidVersions = require('./lib/invalidVersions');

module.exports = function nvs(versions, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if (!versions.length) return callback(new Error('No versions provided'));
  var invalids = invalidVersions(versions);
  if (invalids.length) return callback(new Error('Invalid versions: ' + invalids.join(' ')));

  var queue = new Queue(1);
  var platform = options.platform || process.platform;
  if (platform === 'win32') {
    options.silent || console.log('Windows versions not supported yet. Using system version of Node.js');
    queue.defer(exec.bind(null, command, args, options));
  } else {
    for (var i = 0; i < versions.length; i++) {
      var version = versions[i];
      queue.defer(exec.bind(null, 'nave', ['use', version, command].concat(args), options));
    }
  }

  queue.await(function (err) {
    err ? callback(err) : callback(null, platform === 'win32' ? 1 : versions.length);
  });
};
