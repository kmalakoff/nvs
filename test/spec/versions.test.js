var assert = require('assert');
var path = require('path');

var nvs = require('../..');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var EOL = /\r\n|\r|\n/;
var now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

describe('versions', function () {
  describe('happy path', function () {
    it('one version - 12', function (done) {
      nvs(NODE, ['--version'], { versions: '12', now: now, stdout: 'string', cache: true, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    it('latest version - latest', function (done) {
      nvs(NODE, ['--version'], { versions: 'latest', now: now, stdout: 'string', cache: true, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v13.14.0');
        done();
      });
    });

    it('lts version - lts/erbium', function (done) {
      nvs(NODE, ['--version'], { versions: 'lts/erbium', now: now, stdout: 'string', cache: true, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    it('lts/argon version - lts/argon', function (done) {
      nvs(NODE, ['--version'], { versions: 'lts/argon', now: now, stdout: 'string', cache: true, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions - 10,12,lts/erbium,latest', function (done) {
      nvs(NODE, ['--version'], { versions: ['10', '12', 'lts/erbium', 'latest'], now: now, stdout: 'string', cache: true, silent: true }, function (
        err,
        results
      ) {
        assert.ok(!err);
        assert.ok(results.length > 0);

        // TODO: return to asc or add as an option
        assert.equal(results[2].stdout.split(EOL).slice(-2, -1)[0], 'v10.20.1');
        assert.equal(results[1].stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v13.14.0');
        done();
      });
    });

    it('using engines - 12', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
      nvs(NODE, ['--version'], { engines: true, now: now, stdout: 'string', cache: true, cwd: cwd, silent: true }, function (err, results) {
        assert.ok(!err);
        assert.ok(results.length > 0);
        assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    describe('promise', function () {
      if (typeof Promise === 'undefined') return; // no promise support

      it('using engines - 12 (promise)', function (done) {
        var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines'));
        nvs(NODE, ['--version'], { engines: true, now: now, stdout: 'string', cache: true, cwd: cwd, silent: true })
          .then(function (results) {
            assert.ok(results.length > 0);
            assert.equal(results[0].stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('unhappy path', function () {
    it('no versions', function (done) {
      nvs(NODE, ['--version'], { cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('no versions in list', function (done) {
      nvs(NODE, ['--version'], { versions: [], now: now, stdout: 'string', cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs(NODE, ['--version'], { versions: ['1.d.4'], now: now, stdout: 'string', cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('invalid versions', function (done) {
      nvs(NODE, ['--version'], { versions: ['14', 'bob'], now: now, stdout: 'string', cache: true, silent: true }, function (err) {
        assert.ok(!!err);
        done();
      });
    });

    it('engines missing', function (done) {
      var cwd = path.resolve(path.join(__dirname, '..', 'data', 'engines-missing'));
      nvs(
        NODE,
        ['--version'],
        {
          engines: true,
          now: now,
          stdout: 'string',
          cache: true,
          cwd: cwd,
          silent: true,
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
          cache: true,
          cwd: cwd,
          silent: true,
        },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });
  });
});
