/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const lib = require('./lib');

const PAGES_FILE = 'pages.yml';
const NGINX_OUT_PATH = './out';

const { dockerConf, prodConf } = lib.makeNginxConfigs(PAGES_FILE);

fs.writeFileSync(path.join(NGINX_OUT_PATH, 'nginx.docker.conf'), dockerConf);
fs.writeFileSync(path.join(NGINX_OUT_PATH, 'nginx.conf'), prodConf);
