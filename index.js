const spawn = require('cross-spawn');
const Queue = require('queue-cb');

function exec(cmd, args, callback) {
  console.log('----------------------');
  console.log([cmd].concat(args).join(' '));
  console.log('----------------------');
  var child = spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', callback).on('close', function (exitCode) {
    if (exitCode === 0) return callback();
    var err = new Error('exit');
    err.exitCode = exitCode;
    return callback(err);
  });
}

module.exports = function nvs(versions, command, options, callback) {
  options = options || {};
  var queue = new Queue(1);
  var counter = 0;

  var platform = options.platform || process.platform;
  if (platform === 'win32') {
    console.log('Windows versions not supported yet. Using system version of Node.js');
    counter++;
    queue.defer(exec.bind(null, command.shift(), command));
  } else {
    for (var version of versions) {
      counter++;
      queue.defer(exec.bind(null, 'nave', ['use', version].concat(command)));
    }
  }

  queue.await(function (err) {
    err ? callback(err) : callback(null, counter);
  });
};
