// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const cr = require('cr');

const nvs = require('nvs');

const NODE = process.platform === 'win32' ? 'node.exe' : 'node';
const now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

const TMP_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp'));
const OPTIONS = {
  cacheDirectory: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
  buildDirectory: path.join(TMP_DIR, 'build'),
  now: now,
  encoding: 'utf8',
  silent: true,
};

describe('versions', () => {
  before((callback) => {
    rimraf(TMP_DIR, callback.bind(null, null));
  });

  it('one version - 12', (done) => {
    nvs('12', NODE, ['--version'], OPTIONS, (err, results) => {
      assert.ok(!err);
      assert.ok(results.length > 0);
      assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
      done();
    });
  });
});
