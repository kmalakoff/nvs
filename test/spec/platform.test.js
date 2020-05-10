var assert = require('assert');

var nvs = require('../..');

describe('platform', function () {
  it('native platform', function (done) {
    nvs('node', ['--version'], { versions: [12, 14], cache: true, silent: true }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, process.platform === 'win32' ? 1 : 2);
      done();
    });
  });

  it('emulate win32 platform', function (done) {
    nvs('node', ['--version'], { versions: [12, 14], cache: true, platform: 'win32', silent: true }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, 1);
      done();
    });
  });
});
