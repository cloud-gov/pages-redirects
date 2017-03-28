/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const lib = require('./lib');

const PAGES_FILE = 'pages.yml';
const NGINX_OUT_PATH = './out';

const pageConfigs = lib.getPageConfigs(fs.readFileSync(PAGES_FILE, 'utf-8'));
const { dockerConf, prodConf } = lib.makeNginxConfigs(pageConfigs);

fs.writeFileSync(path.join(NGINX_OUT_PATH, 'nginx.docker.conf'), dockerConf);
fs.writeFileSync(path.join(NGINX_OUT_PATH, 'nginx.conf'), prodConf);
console.log(`Wrote nginx configs to ${NGINX_OUT_PATH}`);
