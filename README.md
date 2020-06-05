## nvs

Cross-platform solution for using multiple versions of node. Useful for compatibility testing.

cli

```
# specific version
$ nvs 14.4.0 npm run test

# highest of version
$ nvs 12 npm run test

# lts
$ nvs lts npm run test

# comma-delimiter list
$ nvs 0.8,4,8,14 npm run test

# use expression
$ nvs >=0.8 node --version

# use engines.node from package.json
$ nvs engines node --version
```

JavaScript

```
var assert = require('assert');
var nvs = require('nvs');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';

// results is an array per-version of form {version, error, result}
nvs('>=0.8', NODE, ['--version'], { versions: '12', stdio: 'inherit' }, function (err, results) {
  assert.ok(!err);
});

// results is an array per-version of form {version, error, result}
await nvs('engines', NODE, ['--version'], { versions: '12', stdio: 'inherit' });
```
