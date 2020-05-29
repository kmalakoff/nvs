var path = require('path');
var NodeSemvers = require('node-semvers');
var isArray = require('isarray');
var uniq = require('lodash.uniq');
var semver = require('semver');

function resolve(key, semvers, results, options) {
  var version = semvers.resolve(key, options);
  if (!version || (isArray(version) && !version.length)) return new Error('Unrecognized version ' + key);
  isArray(version) ? Array.prototype.push.apply(results, version) : results.push(version);
}

module.exports = function resolveVersions(options, callback) {
  NodeSemvers.load({ cache: options.cache }, function (err, semvers) {
    if (err) return callback(err);

    var results = [];
    if (options.versions) {
      var versions = isArray(options.versions) ? options.versions : [options.versions];
      for (var index = 0; index < versions.length; index++) {
        err = resolve(versions[index], semvers, results, options);
        if (err) return callback(err);
      }
    }
    if (options.engines) {
      try {
        var fullPath = path.join(options.cwd || process.cwd(), 'package.json');
        var pkg = require(fullPath);
        if (typeof pkg.engines === 'undefined') return callback(new Error('engines not found in ' + fullPath));
        if (typeof pkg.engines.node === 'undefined') return callback(new Error('engines node not found in ' + fullPath));
        err = resolve(pkg.engines.node, semvers, results, options);
        if (err) return callback(err);
      } catch (err) {
        return callback(err);
      }
    }

    // unique and sorted
    results = uniq(results).sort(function (a, b) {
      return semver.gt(a, b) ? 1 : -1;
    });

    callback(null, results);
  });
};
