/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const nunjucks = require('nunjucks');
const argv = require('minimist')(process.argv.slice(2));

const lib = require('./lib');

const PAGES_FILE = 'pages.yml';
const NGINX_TEMPLATE_FILE = 'nginx.conf.nj';
const NGINX_OUT_FILE = 'nginx.conf';
const NGINX_OUT_PATH = './out';


const contextDefaults = {
  PORT: '<%= ENV["PORT"] %>',
  PAGE_CONFIGS: lib.getPageConfigs(PAGES_FILE),
};

nunjucks.configure('templates', { autoescape: false });

const localContext = {};

if (argv.docker) {
  localContext.IS_DOCKER = true;
  localContext.PORT = 80;
  console.log(`Building ${NGINX_OUT_FILE} in docker mode`);
}

const context = Object.assign({}, contextDefaults, localContext);

const nginxConf = nunjucks.render(NGINX_TEMPLATE_FILE, context);
const outFile = `nginx${argv.docker ? '.docker' : ''}.conf`;

fs.writeFileSync(path.join(NGINX_OUT_PATH, outFile), nginxConf);
