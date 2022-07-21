var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var isVersion = require('is-version');
var cr = require('cr');

var CLI = path.join(__dirname, '..', '..', 'bin', 'nvs.js');

describe('cli', function () {
  it('one version - 12', function (done) {
    spawn(CLI, ['12', '--silent', 'npm', '--version'], { encoding: 'utf8' }, function (err, res) {
      assert.ok(!err);
      var lines = cr(res.stdout).split('\n');
      assert.ok(isVersion(lines.slice(-2, -1)[0]));
      done();
    });
  });
});
