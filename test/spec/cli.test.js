var assert = require('assert');
var path = require('path');

var exec = require('../../lib/exec');

describe('cli', function () {
  describe.only('happy path', function () {
    it('one version', function (done) {
      exec([path.join(__dirname, '..', '..', 'bin', 'nvs'), '14', 'node', '--version'], function (err, code) {
        assert.ok(!err);
        assert.equal(code, 0);
        done();
      });
    });

    it('multiple versions', function (done) {
      exec([path.join(__dirname, '..', '..', 'bin', 'nvs'), '12,14', 'node', '--version'], function (err, code) {
        assert.ok(!err);
        assert.equal(code, 0);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      exec([path.join(__dirname, '..', '..', 'bin', 'nvs')], function (err, code) {
        assert.ok(!!err);
        done();
      });
    });

    it('missing versions', function (done) {
      exec([path.join(__dirname, '..', '..', 'bin', 'nvs'), 'node', '--version'], function (err, code) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      exec([path.join(__dirname, '..', '..', 'bin', 'nvs'), 'junk,junk', 'node', '--version'], function (err, code) {
        assert.ok(!!err);
        done();
      });
    });
  });
});
