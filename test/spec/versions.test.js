var assert = require('assert');
var path = require('path');
var isVersion = require('is-version');
var cr = require('cr');

var nvs = require('../..');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

describe('versions', function () {
  describe('happy path', function () {
    it('one version - 12', function (done) {
      nvs('12', NODE, ['--version'], { stdout: 'string', silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('latest version - latest', function (done) {
      nvs('latest', NODE, ['--version'], { stdout: 'string', silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.ok(isVersion(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0], 'v'));
        done();
      });
    });

    it('lts version - lts/erbium', function (done) {
      nvs('lts/erbium', NODE, ['--version'], { stdout: 'string', silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    it('lts/argon version - lts/argon', function (done) {
      nvs('lts/argon', NODE, ['--version'], { stdout: 'string', silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions - 10,12,lts/erbium,latest', function (done) {
      nvs('10,12,lts/erbium,latest', NODE, ['--version'], { stdout: 'string', silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);

        // TODO: return to asc or add as an option
        assert.equal(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0], 'v10.20.1');
        assert.ok(cr(results[1].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
        assert.ok(isVersion(cr(results[2].result.stdout).split('\n').slice(-2, -1)[0], 'v'));
        done();
      });
    });

    it('using engines - 12', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      nvs('engines', NODE, ['--version'], { stdout: 'string', cwd: cwd, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
        done();
      });
    });

    describe('promise', function () {
      if (typeof Promise === 'undefined') return; // no promise support

      it('using engines - 12 (promise)', function (done) {
        var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
        nvs('engines', NODE, ['--version'], { stdout: 'string', cwd: cwd, silent: true })
          .then(function (results) {
            assert.ok(results.length > 0);
            assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('unhappy path', function () {
    it('invalid versions', function (done) {
      nvs('1.d.4', NODE, ['--version'], { stdout: 'string', silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs('14,bob', NODE, ['--version'], { stdout: 'string', silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('engines missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-missing'));
      nvs(
        'engines',
        NODE,
        ['--version'],
        {
          now: now,
          stdout: 'string',
          cwd: cwd,
        },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });

    it('engines node missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing'));
      nvs(
        NODE,
        ['--version'],
        {
          engines: true,
          now: now,
          stdout: 'string',
          cwd: cwd,
        },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });
  });
});
