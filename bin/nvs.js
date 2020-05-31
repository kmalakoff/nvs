#!/usr/bin/env node

var getopts = require('getopts-compat');

(function () {
  var options = getopts(process.argv.slice(3), {
    alias: { range: 'r', silent: 's' },
    default: { range: 'major,even' },
    boolean: ['silent'],
    stopEarly: true,
  });

  // define.option('-r, --range [range]', 'range type of major, minor, or patch with filters of lts, even, odd for version string expressions', 'major,even');
  // define.option('-s, --silent', 'suppress logging', false);

  var args = process.argv.slice(2, 3).concat(options._);
  if (args.length < 1) {
    console.log('Missing command. Example usage: nvs [version expression] [command]');
    return process.exit(-1);
  }
  var nvs = require('..');

  if (!options.silent)
    options.header = function (version, command, args) {
      console.log('\n----------------------');
      console.log([command].concat(args).join(' ') + ' (' + version + ')');
      console.log('----------------------');
    };

  nvs(args[0], args[1], args.slice(2), options, function (err, results) {
    if (err) {
      console.log(err.message);
      return process.exit(err.code || -1);
    }
    var errors = [];
    for (var index = 0; index < results.length; index++) {
      var result = results[index];
      if (result.error || result.result.code !== 0) errors.push(results[index]);
    }

    if (!options.silent) {
      console.log('\n======================');
      if (errors.length) {
        console.log('Errors (' + errors.length + ')');
        // eslint-disable-next-line no-redeclare
        for (var index = 0; index < errors.length; index++) {
          // eslint-disable-next-line no-redeclare
          var result = errors[index];
          if (result.error) console.log(result.version + ' Error: ' + result.error.message);
          else console.log(result.version + ' Exit Code: ' + result.result.code);
        }
      } else console.log('Success (' + results.length + ')');
      console.log('======================');
    }

    process.exit(errors.length ? -1 : 0);
  });
})();
