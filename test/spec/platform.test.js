var assert = require('assert');

var nvs = require('../..');

describe('platform', function () {
  it('native platform', function (done) {
    nvs(['12', '14'], 'node', ['--version'], { silent: true }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, process.platform === 'win32' ? 1 : 2);
      done();
    });
  });

  it('emulate win32 platform', function (done) {
    nvs(['12', '14'], 'node', ['--version'], { platform: 'win32', silent: true }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, 1);
      done();
    });
  });
});
