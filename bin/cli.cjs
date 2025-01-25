#!/usr/bin/env node

var spawn = require('cross-spawn-cb');
spawn.sync('nvu', process.argv.slice(2), { stdio: 'inherit' })
