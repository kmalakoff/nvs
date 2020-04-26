module.exports = function invalidVersions(versions) {
  var invalids = [];
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    if (version === 'latest' || version.substr(0, 'lts'.length) === 'lts' || version.substr(0, 'lts'.length + 1) === 'lts/') continue;

    var valid = true;
    var components = version.split('.');
    for (var j = 0; j < components.length; j++) {
      valid = !isNaN(+components[j]);
      if (!valid) break;
    }
    if (!valid) invalids.push(version);
  }
  return invalids;
};
