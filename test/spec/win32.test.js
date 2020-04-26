var assert = require('assert');

var nvs = require('../..');

describe('win32', function () {
  it('run commands', function (done) {
    nvs(['12', '14'], ['node', '--version'], { platform: 'win32' }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, 1);
      done();
    });
  });
});
