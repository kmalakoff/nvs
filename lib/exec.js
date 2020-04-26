var spawn = require('cross-spawn');
var callOnce = require('call-once-next-tick');

module.exports = function exec(command, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  callback = callOnce(callback);

  var child = spawn(command[0], command.slice(1), { stdio: 'inherit', cwd: options.cwd });
  child.on('error', callback);
  child.on('close', function (code) {
    if (code === 0) return callback(null, code);
    var err = new Error('exit(' + code + ')');
    err.errorCode = code;
    return callback(err);
  });
};
