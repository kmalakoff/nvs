## nvs

Run commands on multiple versions of node. Useful for compatibility testing.

cli

```
$ nvs 0.8,4,8,14 run npm
$ nvs 0.8,4,8,14 -- node --version
```

JavaScript

```
var assert = require('assert');
var nvs = require('nvs');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';

nvs(NODE, ['--version'], { versions: '12', stdio: 'inherit' }, function (err) {
  assert.ok(!err);
});

await nvs(NODE, ['--version'], { versions: '12', stdio: 'inherit' });
```
