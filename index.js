const spawn = require('cross-spawn');
const Queue = require('queue-cb');

function exec(cmd, args, options, callback) {
  if (!options.silent) {
    console.log('----------------------');
    console.log([cmd].concat(args).join(' '));
    console.log('----------------------');
  }

  var child = spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', callback).on('close', function (exitCode) {
    if (exitCode === 0) return callback();
    var err = new Error('exit');
    err.exitCode = exitCode;
    return callback(err);
  });
}

module.exports = function nvs(versions, command, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  var queue = new Queue(1);

  var platform = options.platform || process.platform;
  if (platform === 'win32') {
    options.silent || console.log('Windows versions not supported yet. Using system version of Node.js');
    queue.defer(exec.bind(null, command.shift(), command, options));
  } else {
    for (var index = 0; index < versions.length; index++) {
      queue.defer(exec.bind(null, 'nave', ['use', versions[index]].concat(command), options));
    }
  }

  queue.await(function (err) {
    err ? callback(err) : callback(null, platform === 'win32' ? 1 : versions.length);
  });
};
