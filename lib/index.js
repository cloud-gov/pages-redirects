const yaml = require('js-yaml');
const nunjucks = require('nunjucks');

nunjucks.configure('./templates', { autoescape: false });

const NGINX_TEMPLATE_FILE = 'nginx.conf.njk';
const MANIFEST_TEMPLATE_FILE = 'manifest-prod.yml.njk';
const DEFAULT_TO_DOMAIN = '18f.gov';
const DEFAULT_TO_PATH = '';

function getPageConfigs(yamlConfigString) {
  const contents = yaml.safeLoad(yamlConfigString);

  if (!contents || !contents.length) {
    return [];
  }

  const configs = contents.map((c) => {
    if (typeof c === 'string') {
      // simple redirect case of pages.18f.gov/<NAME> to <NAME>.18f.gov
      return { from: c, to: c, toDomain: DEFAULT_TO_DOMAIN, toPath: DEFAULT_TO_PATH };
    }
    if (!c.from || !c.to) {
      throw new Error('Non-string configs must have "to" and "from" properties');
    }
    return {
      from: c.from,
      to: c.to,
      toDomain: c.toDomain || DEFAULT_TO_DOMAIN,
      toPath: c.toPath || DEFAULT_TO_PATH,
    };
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
    PORT: 80,
  });

  const dockerConf = nunjucks.render(NGINX_TEMPLATE_FILE, dockerContext);
  const prodConf = nunjucks.render(NGINX_TEMPLATE_FILE, defaultContext);

  return { dockerConf, prodConf };
}

function makeManifest(pageConfigs) {
  const context = {
    PAGE_CONFIGS: pageConfigs,
  };

  const manifest = nunjucks.render(MANIFEST_TEMPLATE_FILE, context);

  return manifest;
}


module.exports = {
  getPageConfigs,
  makeNginxConfigs,
  makeManifest,
};
