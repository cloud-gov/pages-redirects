const fs = require('fs');
const test = require('tape');
const yaml = require('js-yaml');

const DOCKER_COMPOSE_FILE = './docker-compose.yml';
const TEST_CLIENT_DOCKER_NAME = 'test_client';
const APP_DOCKER_NAME = 'app';
const PROD_NGINX_CONF = './out/nginx.conf';
const DOCKER_NGINX_CONF = './out/nginx.docker.conf';

const composeConfig = yaml.load(fs.readFileSync(DOCKER_COMPOSE_FILE, 'utf-8'));
const externalLinks = composeConfig.services[TEST_CLIENT_DOCKER_NAME].external_links;

const prodNginxConf = fs.readFileSync(PROD_NGINX_CONF, 'utf-8');
const dockerNginxConf = fs.readFileSync(DOCKER_NGINX_CONF, 'utf-8');

function getServerNames(nginxConf) {
  // Returns an array of the urls of all servers identified in the
  // `server_name` directives of the given nginx config file string
  return nginxConf.split('\n').map(s => s.trim()).reduce((acc, line) => {
    if (line.startsWith('server_name')) {
      const namesFromLine = line.replace(';', '').split(/\s+/).slice(1);
      namesFromLine.forEach((n) => {
        acc.push(n);
      });
    }
    return acc;
  }, []);
}

function serverNamesAreInExternalLinks(t, serverNames) {
  serverNames.forEach((url) => {
    t.ok(externalLinks.indexOf(`${APP_DOCKER_NAME}:${url}`) >= 0);
  });
}

test('getServerNames works', (t) => {
  const testConfig = [
    'blahblah;',
    'server {',
    '  listen 80;',
    '  server_name test1.org test2.com    test3.net;',
    '}',
    '',
    'server {',
    '  listen 80;',
    '  server_name www.test4.gov;',
    '}',
  ].join('\n');

  const serverNames = getServerNames(testConfig);
  t.deepEqual(serverNames, ['test1.org', 'test2.com', 'test3.net', 'www.test4.gov']);
  t.end();
});

test('nginx.conf and nginx.docker.conf have same server_names', (t) => {
  const prodServers = getServerNames(prodNginxConf);
  const dockerServers = getServerNames(dockerNginxConf);
  t.ok(prodServers.length > 0);
  t.deepEqual(prodServers, dockerServers);
  t.end();
});

test('docker-compose.yml has all server_names from nginx.conf', (t) => {
  serverNamesAreInExternalLinks(t, getServerNames(prodNginxConf));
  t.end();
});

test('docker-compose.yml has all server_names from nginx.docker.conf', (t) => {
  serverNamesAreInExternalLinks(t, getServerNames(dockerNginxConf));
  t.end();
});
