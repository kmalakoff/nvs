var execa = require('execa');

module.exports = function exec(command, args, options, callback) {
  if (!options.silent) {
    console.log('----------------------');
    console.log([command].concat(args).join(' '));
    console.log('----------------------');
  }
  execa(command, args, options)
    .then(function (res) {
      callback(null, res);
    })
    .catch(callback);
};
