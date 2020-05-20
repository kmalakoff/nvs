var nvu = require('node-version-use');
var Queue = require('queue-cb');

var resolveVersions = require('./resolveVersions');

module.exports = function useVersions(command, args, options, callback) {
  resolveVersions(options, function (err, versions) {
    if (err) return callback(err);
    if (!versions.length) return callback(new Error('No versions provided'));

    var errors = [];
    var results = [];
    var queue = new Queue(1);
    for (var index = 0; index < versions.length; index++) {
      (function () {
        var version = versions[index];
        queue.defer(function (callback) {
          console.log('');
          console.log('| ' + version + ' |');

          nvu(version, command, args, options, function (err, res) {
            err ? errors.push(err) : results.push(res);
            callback();
          });
        });
      })();
    }
    queue.await(function () {
      errors.length ? callback(errors) : callback(null, results);
    });
  });
};
