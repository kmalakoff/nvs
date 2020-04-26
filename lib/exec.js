const spawn = require('cross-spawn');
const callOnce = require('call-once-next-tick');

module.exports = function exec(cmd, args, callback) {
  callback = callOnce(callback);

  var child = spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', callback);
  child.on('close', function (code) {
    if (code === 0) return callback(null, code);
    var err = new Error('exit(' + code + ')');
    err.errorCode = code;
    return callback(err);
  });
};
