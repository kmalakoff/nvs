var assert = require('assert');
var path = require('path');
var execa = require('execa');

describe('cli', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      execa(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['14', 'node', '--version'])
        .then(function (res) {
          assert.equal(res.exitCode, 0);
          done();
        })
        .catch(function (err) {
          assert.ok(!err);
        });
    });

    it('multiple versions', function (done) {
      execa(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['12,14', 'node', '--version'])
        .then(function (res) {
          assert.equal(res.exitCode, 0);
          done();
        })
        .catch(function (err) {
          assert.ok(!err);
        });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      execa(path.join(__dirname, '..', '..', 'bin', 'nvs'), [])
        .then(function () {
          assert.ok(false);
        })
        .catch(function (err) {
          assert.ok(!!err);
          done();
        });
    });

    it('missing versions', function (done) {
      execa(path.join(__dirname, '..', '..', 'bin', 'nvs'), 'node', ['--version'])
        .then(function () {
          assert.ok(false);
        })
        .catch(function (err) {
          assert.ok(!!err);
          done();
        });
    });

    it('invalid versions', function (done) {
      execa(path.join(__dirname, '..', '..', 'bin', 'nvs'), ['junk,junk', 'node', '--version'])
        .then(function () {
          assert.ok(false);
        })
        .catch(function (err) {
          assert.ok(!!err);
          done();
        });
    });
  });
});
