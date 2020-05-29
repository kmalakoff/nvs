var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var isVersion = require('is-version');

var CLI = path.join(__dirname, '..', '..', 'bin', 'nvs');
var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var EOL = /\r\n|\r|\n/;

describe('cli', function () {
  describe('happy path', function () {
    it('one version - 12', function (done) {
      spawn(CLI, ['--versions', '12', 'npm', '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(isVersion(res.stdout.split(EOL).slice(-2, -1)[0]));
        done();
      });
    });

    it('multiple versions - lts/argon,12', function (done) {
      spawn(CLI, ['--versions', 'lts/argon,12', 'npm', '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(isVersion(res.stdout.split(EOL).slice(-2, -1)[0]));
        done();
      });
    });

    it('one version with options - lts/erbium', function (done) {
      spawn(CLI, ['--versions', 'lts/erbium', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(res.stdout.split(EOL).slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('one version with options - lts/argon', function (done) {
      spawn(CLI, ['--versions', 'lts/argon', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions with options - 10,12,lts/erbium,latest', function (done) {
      spawn(CLI, ['--versions', '10,12,lts/erbium,latest', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        // TODO: return to asc or add as an option
        assert.ok(isVersion(res.stdout.split(EOL).slice(-2, -1)[0], 'v'));
        done();
      });
    });

    it('using engines - 12', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      spawn(CLI, ['--engines', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(res.stdout.split(EOL).slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('using engines - 12 (--)', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      spawn(CLI, ['--engines', '--', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(res.stdout.split(EOL).slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(CLI, ['--versions', '--cache'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('missing versions', function (done) {
      spawn(CLI, ['--versions', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('invalid versions', function (done) {
      spawn(CLI, ['--versions', 'junk,junk', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('engines missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-missing'));
      spawn(CLI, ['--engines', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('engines node missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing'));
      spawn(CLI, ['--engines', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });
  });
});
