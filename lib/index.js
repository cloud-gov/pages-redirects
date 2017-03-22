const fs = require('fs');
const yaml = require('js-yaml');

function getPageConfigs(configFile) {
  const contents = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
  const configs = contents.map((c) => {
    if (typeof c === 'string') {
      return { from: c, to: c };
    }
    if (!c.from || !c.to) {
      throw new Error('Non-string configs must have "to" and "from" properties');
    }
    return c;
  });
  return configs;
}

module.exports = {
  getPageConfigs,
};
