// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const rimraf2 = require('rimraf2');
const cr = require('cr');

const nvs = require('nvs');

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';
const now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

const TMP_DIR = path.join(path.join(__dirname, '..', '..', '.tmp'));
const OPTIONS = {
  cachePath: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
  buildPath: path.join(TMP_DIR, 'build'),
  now,
  encoding: 'utf8',
  silent: true,
};

describe('versions', () => {
  before(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));

  it('one version - 12', (done) => {
    nvs('12', NODE, ['--version'], OPTIONS, (err, results) => {
      if (err) return done(err.message);
      assert.ok(results.length > 0);
      assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
      done();
    });
  });
});
