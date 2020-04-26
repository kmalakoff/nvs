var assert = require('assert');

var nvs = require('../..');

describe('macos', function () {
  it('run commands', function (done) {
    nvs(['12', '14'], ['node', '--version'], { platform: 'macos' }, function (err, count) {
      assert.ok(!err);
      assert.equal(count, 2);
      done();
    });
  });
});
