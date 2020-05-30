var nvu = require('node-version-use');
var Queue = require('queue-cb');
var assign = require('object-assign');
var resolveVersions = require('node-resolve-versions');

module.exports = function useVersions(versionExpression, command, args, options, callback) {
  resolveVersions(versionExpression, options, function (err, versions) {
    if (err) return callback(err);
    if (!versions.length) return callback(new Error('No versions found from expression: ' + versionExpression));

    var spawnOptions = assign({}, options);
    if (!spawnOptions.stdout && !spawnOptions.stdio) spawnOptions.stdio = 'inherit';

    var results = [];
    var queue = new Queue(1);
    for (var index = 0; index < versions.length; index++) {
      (function (version) {
        queue.defer(function (callback) {
          !options.header || options.header(version, command, args);
          nvu(version, command, args, spawnOptions, function (err, res) {
            results.push({ version: version, error: err, result: res });
            callback();
          });
        });
      })(versions[index]);
    }
    queue.await(function (err) {
      err ? callback(err) : callback(null, results);
    });
  });
};
