var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var isVersion = require('is-version');
var cr = require('cr');

var CLI = path.join(__dirname, '..', '..', 'bin', 'nvs.js');
var NODE = process.platform === 'win32' ? 'node.exe' : 'node';

describe('cli', function () {
  describe('happy path', function () {
    it('one version - 12', function (done) {
      spawn(CLI, ['12', '--silent', 'npm', '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(isVersion(lines.slice(-2, -1)[0]));
        done();
      });
    });

    it('multiple versions - lts/argon,12', function (done) {
      spawn(CLI, ['lts/argon,12', '--silent', 'npm', '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(isVersion(lines.slice(-2, -1)[0]));
        done();
      });
    });

    it('one version with options - lts/erbium', function (done) {
      spawn(CLI, ['lts/erbium', '--silent', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(lines.slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('one version with options - lts/argon', function (done) {
      spawn(CLI, ['lts/argon', '--silent', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions with options - 10,12,lts/erbium,latest', function (done) {
      spawn(CLI, ['10,12,lts/erbium,latest', '--silent', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        // TODO: return to asc or add as an option
        var lines = cr(res.stdout).split('\n');
        assert.ok(isVersion(lines.slice(-2, -1)[0], 'v'));
        done();
      });
    });

    it('using engines - 12', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      spawn(CLI, ['engines', '--silent', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(lines.slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('using engines - 12 (--)', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      spawn(CLI, ['engines', '--silent', '--', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(lines.slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(CLI, [], { stdout: 'string' }, function (err, res) {
        assert.ok(!!err);
        done();
      });
    });

    it('missing versions', function (done) {
      spawn(CLI, [NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      spawn(CLI, ['junk,junk', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!!err);
        done();
      });
    });

    it('engines missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-missing'));
      spawn(CLI, ['engines', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!!err);
        done();
      });
    });

    it('engines node missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing'));
      spawn(CLI, ['engines', NODE, '--version'], { stdout: 'string', cwd: cwd }, function (err, res) {
        assert.ok(!!err);
        done();
      });
    });
  });
});
