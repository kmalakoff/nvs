var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

describe('cli', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '14', '--cache', 'npm', 'whoami'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('multiple versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '12,14', '--cache', 'npm', 'whoami'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('one version with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '14', '--cache', '--', 'node', '--version'], { stdio: 'inherit' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('multiple versions with options', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '12,14', '--cache', '--', 'node', '--version'], { stdio: 'inherit' }, function (
        err,
        res
      ) {
        assert.ok(!err);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('using engines', function (done) {
      spawn(
        path.join(__dirname, '..', '..', 'bin', 'nvs'),
        ['--engines', '--cache', '--', 'node', '--version'],
        { stdio: 'inherit', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines')) },
        function (err, res) {
          assert.ok(!err);
          assert.equal(res.code, 0);
          done();
        }
      );
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '--cache'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('missing versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', '--cache', '--', 'node', '--version'], { stdio: 'inherit' }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.code !== 0);
        done();
      });
    });

    it('invalid versions', function (done) {
      spawn(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['--versions', 'junk,junk', '--cache', '--', 'node', '--version'], { stdio: 'inherit' }, function (
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
        ['--engines', '--cache', '--', 'node', '--version'],
        { stdio: 'inherit', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-missing')) },
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
        ['--engines', '--cache', '--', 'node', '--version'],
        { stdio: 'inherit', cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing')) },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.code !== 0);
          done();
        }
      );
    });
  });
});
