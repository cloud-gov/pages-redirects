const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');

nunjucks.configure('../templates', { autoescape: false });


const NGINX_TEMPLATE_FILE = 'nginx.conf.nj';

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

function makeNginxConfigs(pagesConfigFile) {
  const defaultContext = {
    PORT: '<%= ENV["PORT"] %>',
    PAGE_CONFIGS: getPageConfigs(pagesConfigFile),
  };

  const dockerContext = Object.assign({}, defaultContext, {
    IS_DOCKER: true,
    PORT: 80,
  });

  nunjucks.configure('templates', { autoescape: false });

  const dockerConf = nunjucks.render(NGINX_TEMPLATE_FILE, dockerContext);
  const prodConf = nunjucks.render(NGINX_TEMPLATE_FILE, defaultContext);

  return { dockerConf, prodConf };
}

module.exports = {
  getPageConfigs,
  makeNginxConfigs,
};
