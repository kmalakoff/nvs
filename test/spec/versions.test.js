var assert = require('assert');
var path = require('path');

var nvs = require('../..');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var EOL = /\r\n|\r|\n/;
var now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

describe('versions', function () {
  describe('happy path', function () {
    it('one version', function (done) {
      nvs(NODE, ['--version'], { versions: '12', now: now, stdout: 'string', cache: true, silent: true }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.count > 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    it('latest version', function (done) {
      nvs(NODE, ['--version'], { versions: 'latest', now: now, stdout: 'string', cache: true, silent: true }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.count > 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v13.14.0');
        done();
      });
    });

    it('lts version', function (done) {
      nvs(NODE, ['--version'], { versions: 'lts/erbium', now: now, stdout: 'string', cache: true, silent: true }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.count > 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v12.16.3');
        done();
      });
    });

    it('lts/argon version', function (done) {
      nvs(NODE, ['--version'], { versions: 'lts/argon', now: now, stdout: 'string', cache: true, silent: true }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.count > 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v4.9.1');
        done();
      });
    });

    it('multiple versions', function (done) {
      nvs(NODE, ['--version'], { versions: ['10', '12', 'lts/erbium', 'latest'], now: now, stdout: 'string', cache: true, silent: true }, function (err, res) {
        assert.ok(!err);
        assert.ok(res.count > 0);
        assert.equal(res.stdout.split(EOL).slice(-2, -1)[0], 'v13.14.0');
        done();
      });
    });

    it('using engines', function (done) {
      nvs(
        NODE,
        ['--version'],
        { engines: true, now: now, stdout: 'string', cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines')), silent: true },
        function (err, res) {
          assert.ok(!err);
          assert.ok(res.count > 0);
          done();
        }
      );
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
      nvs(
        NODE,
        ['--version'],
        { engines: true, now: now, stdout: 'string', cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-missing')), silent: true },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });

    it('engines node missing', function (done) {
      nvs(
        NODE,
        ['--version'],
        { engines: true, now: now, stdout: 'string', cache: true, cwd: path.resolve(path.join(__dirname, '..', 'data', 'engines-node-missing')), silent: true },
        function (err) {
          assert.ok(!!err);
          done();
        }
      );
    });
  });
});
