// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const isVersion = require('is-version');
const cr = require('cr');

const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.cjs');

describe('cli', () => {
  it('one version - 12', (done) => {
    spawn(CLI, ['--silent', '12', 'npm', '--version'], { encoding: 'utf8' }, (err, res) => {
      if (err) return done(err.message);
      const lines = cr(res.stdout).split('\n');
      assert.ok(isVersion(lines.slice(-2, -1)[0]));
      done();
    });
  });
});
