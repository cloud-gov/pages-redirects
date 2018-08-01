/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const lib = require('./lib');

const PAGES_FILE = 'pages.yml';
const OUT_FOLDER = './out';

const pageConfigs = lib.getPageConfigs(fs.readFileSync(PAGES_FILE, 'utf-8'));
const { dockerConf, prodConf } = lib.makeNginxConfigs(pageConfigs);
const prodManifest = lib.makeManifest(pageConfigs);

fs.writeFileSync(path.join(OUT_FOLDER, 'nginx.docker.conf'), dockerConf);
fs.writeFileSync(path.join(OUT_FOLDER, 'nginx.conf'), prodConf);
fs.writeFileSync(path.join(OUT_FOLDER, 'manifest-prod.yml'), prodManifest);
fs.createReadStream('mime.types').pipe(fs.createWriteStream(path.join(OUT_FOLDER, 'mime.types')));

console.log(`Wrote nginx configs and manifest-prod.yml to ${OUT_FOLDER}`);
