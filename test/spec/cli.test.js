var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

describe('cli', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['14', 'npm', 'whoami'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.exitCode, 0);
        done();
      });
    });

    it('multiple versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['12,14', 'npm', 'whoami'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.exitCode, 0);
        done();
      });
    });

    it('one version with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['14', '--', 'node', '--version'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.exitCode, 0);
        done();
      });
    });

    it('multiple versions with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['12,14', '--', 'node', '--version'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.exitCode, 0);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), [], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.exitCode !== 0);
        done();
      });
    });

    it('missing versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--', 'node', '--version'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.exitCode !== 0);
        done();
      });
    });

    it('invalid versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['junk,junk', '--', 'node', '--version'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.exitCode !== 0);
        done();
      });
    });
  });
});
