const yaml = require('js-yaml');
const nunjucks = require('nunjucks');

nunjucks.configure('../templates', { autoescape: false });


const NGINX_TEMPLATE_FILE = 'nginx.conf.njk';

function getPageConfigs(yamlConfigString) {
  const contents = yaml.safeLoad(yamlConfigString);

  if (!contents || !contents.length) {
    return [];
  }

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


function makeNginxConfigs(pageConfigs) {
  const defaultContext = {
    PORT: '<%= ENV["PORT"] %>',
    PAGE_CONFIGS: pageConfigs,
  };

  const dockerContext = Object.assign({}, defaultContext, {
    IS_DOCKER: true,
    PORT: 8080,
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
