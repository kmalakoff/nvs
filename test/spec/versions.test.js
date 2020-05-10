var assert = require('assert');
var path = require('path');

var nvs = require('../..');

describe('versions', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      nvs('node', ['--version'], { versions: '14', cache: true, silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('latest version', function (done) {
      nvs('node', ['--version'], { versions: 'latest', cache: true, silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('lts version', function (done) {
      nvs('node', ['--version'], { versions: 'lts', cache: true, silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('lts/argon version', function (done) {
      nvs('node', ['--version'], { versions: 'lts/argon', cache: true, silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('multiple versions', function (done) {
      nvs('node', ['--version'], { versions: ['12', '14', 'lts'], cache: true, silent: true }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('using engines', function (done) {
      nvs('node', ['--version'], { engines: true, cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines')), silent: true }, function (
        err
      ) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('no versions', function (done) {
      nvs('node', ['--version'], { cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('no versions in list', function (done) {
      nvs('node', ['--version'], { versions: [], cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs('node', ['--version'], { versions: ['1.d.4'], cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs('node', ['--version'], { versions: ['14', 'bob'], cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('engines missing', function (done) {
      nvs(
        'node',
        ['--version'],
        { engines: true, cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-missing')), silent: true },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });

    it('engines node missing', function (done) {
      nvs(
        'node',
        ['--version'],
        { engines: true, cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing')), silent: true },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });
  });
});
