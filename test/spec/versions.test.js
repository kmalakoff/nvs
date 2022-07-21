var assert = require('assert');
var path = require('path');
var rimraf = require('rimraf');
var cr = require('cr');

var nvs = require('../..');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

var TMP_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp'));
var OPTIONS = {
  cacheDirectory: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
  buildDirectory: path.join(TMP_DIR, 'build'),
  now: now,
  encoding: 'utf8',
  silent: true,
};

describe('versions', function () {
  before(function (callback) {
    rimraf(TMP_DIR, callback.bind(null, null));
  });

  it('one version - 12', function (done) {
    nvs('12', NODE, ['--version'], OPTIONS, function (err, results) {
      assert.ok(!err);
      assert.ok(results.length > 0);
      assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
      done();
    });
  });
});
