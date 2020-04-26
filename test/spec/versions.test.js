var assert = require('assert');

var nvs = require('../..');

describe('versions', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      nvs(['14'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('latest version', function (done) {
      nvs(['latest'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('lts version', function (done) {
      nvs(['lts'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('lts/argon version', function (done) {
      nvs(['lts/argon'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('multiple versions', function (done) {
      nvs(['12', '14', 'lts'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('no versions', function (done) {
      nvs([], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs(['1.d.4'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs(['14', 'bob'], ['node', '--version'], { silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });
  });
});
