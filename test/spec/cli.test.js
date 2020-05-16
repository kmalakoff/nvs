var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var EOL = /\r\n|\r|\n/;

describe('cli', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '12', '--cache', 'npm', 'whoami'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(res.stdout.split(EOL).slice(-2, -1)[0].length > 1);
        done();
      });
    });

    it('multiple versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', 'lts/argon,12', '--cache', 'npm', 'whoami'], { stdout: 'string' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.ok(res.stdout.split(EOL).slice(-2, -1)[0].length > 0);
        done();
      });
    });

    it('one version with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', 'lts/erbium', '--cache', '--', NODE, '--version'], { stdout: 'string' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    it('one version with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', 'lts/argon', '--cache', '--', NODE, '--version'], { stdout: 'string' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.ok(res.code === 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions with options', function (done) {
      spawn(
        path.join(__dirname, '..', '..', 'bin', 'nvs'),
        ['--versions', '10,12,lts/erbium,latest', '--cache', '--', NODE, '--version'],
        { stdout: 'string' },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.code === 0);
          assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v13.14.0');
          done();
        }
      );
    });

    it('using engines', function (done) {
      spawn(
        path.join(__dirname, '..', '..', 'bin', 'nvs'),
        ['--engines', '--cache', '--', NODE, '--version'],
        { stdout: 'string', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines')) },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.code === 0);
          done();
        }
      );
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '--cache'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('missing versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '--cache', '--', NODE, '--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('invalid versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', 'junk,junk', '--cache', '--', NODE, '--version'], { stdout: 'string' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('engines missing', function (done) {
      spawn(
        path.join(__dirname, '..', '..', 'bin', 'nvs'),
        ['--engines', '--cache', '--', NODE, '--version'],
        { stdout: 'string', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-missing')) },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.code !== 0);
          done();
        }
      );
    });

    it('engines node missing', function (done) {
      spawn(
        path.join(__dirname, '..', '..', 'bin', 'nvs'),
        ['--engines', '--cache', '--', NODE, '--version'],
        { stdout: 'string', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing')) },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.code !== 0);
          done();
        }
      );
    });
  });
});
