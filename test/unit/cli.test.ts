// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import isVersion from 'is-version';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.cjs');

describe('cli', () => {
  it('one version - 12', (done) => {
    spawn(CLI, ['--silent', '12', 'npm', '--version'], { encoding: 'utf8' }, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      const lines = cr(res.stdout).split('\n');
      assert.ok(isVersion(lines.slice(-2, -1)[0]));
      done();
    });
  });
});
