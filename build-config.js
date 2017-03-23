/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const nunjucks = require('nunjucks');

const lib = require('./lib');

const PAGES_FILE = 'pages.yml';
const NGINX_TEMPLATE_FILE = 'nginx.conf.nj';
const NGINX_OUT_PATH = './';

const contextDefaults = {
  PORT: '<%= ENV["PORT"] %>',
  PAGE_CONFIGS: lib.getPageConfigs(PAGES_FILE),
};

nunjucks.configure('templates', { autoescape: false });

const localContext = {};


const context = Object.assign({}, contextDefaults, localContext);

const nginxConf = nunjucks.render(NGINX_TEMPLATE_FILE, context);
const outFile = 'nginx.conf';

fs.writeFileSync(path.join(NGINX_OUT_PATH, outFile), nginxConf);
