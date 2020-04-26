var Queue = require('queue-cb');
var exec = require('./lib/exec');

function execCommand(cmd, args, options, callback) {
  if (!options.silent) {
    console.log('----------------------');
    console.log([cmd].concat(args).join(' '));
    console.log('----------------------');
  }
  exec(cmd, args, callback);
}

function invalidVersions(versions) {
  var invalids = [];
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    if (version === 'latest' || version.substr(0, 'lts'.length) === 'lts' || version.substr(0, 'lts'.length + 1) === 'lts/') continue;

    var valid = true;
    var components = version.split('.');
    for (var j = 0; j < components.length; j++) {
      valid = !isNaN(+components[j]);
      if (!valid) break;
    }
    if (!valid) invalids.push(version);
  }
  return invalids;
}

module.exports = function nvs(versions, command, options, callback) {
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
    queue.defer(execCommand.bind(null, command.shift(), command, options));
  } else {
    for (var i = 0; i < versions.length; i++) {
      var version = versions[i];
      queue.defer(execCommand.bind(null, 'nave', ['use', version].concat(command), options));
    }
  }

  queue.await(function (err) {
    err ? callback(err) : callback(null, platform === 'win32' ? 1 : versions.length);
  });
};
