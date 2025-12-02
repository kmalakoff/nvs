// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import cr from 'cr';
import nvs from 'nvs';
import path from 'path';
import rimraf2 from 'rimraf2';
import url from 'url';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';
const now = new Date(Date.parse('2020-05-10T03:23:29.347Z'));

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TMP_DIR = path.join(path.join(__dirname, '..', '..', '.tmp'));
const OPTIONS = {
  cachePath: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
  buildPath: path.join(TMP_DIR, 'build'),
  now,
  encoding: 'utf8' as const,
  silent: true,
};

describe('versions', () => {
  before(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));

  it('one version - 12', (done) => {
    nvs('12', NODE, ['--version'], OPTIONS, (err, results) => {
      if (err) {
        done(err.message);
        return;
      }
      assert.ok(results.length > 0);
      assert.ok(cr(results[0].result.stdout).split('\n').slice(-2, -1)[0].indexOf('v12.') === 0);
      done();
    });
  });
});
