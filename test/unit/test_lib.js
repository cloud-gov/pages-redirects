const test = require('tape');

const lib = require('../../lib');

const PAGES_CONFIG = [
  '---',
  '- test1',
  '- test2',
  '- from: test3from',
  '  to: test3to',
].join('\n');

const EMTPY_CONFIG = '---\n';

test('lib.getPageConfigs', (t) => {
  const configs = lib.getPageConfigs(PAGES_CONFIG);
  t.ok(configs);
  t.equal(configs.length, 3);
  t.same(configs[0], { to: 'test1', from: 'test1' });
  t.same(configs[1], { to: 'test2', from: 'test2' });
  t.same(configs[2], { to: 'test3to', from: 'test3from' });
  t.end();
});

test('lib.getPageConfigs with empty config', (t) => {
  const configs = lib.getPageConfigs(EMTPY_CONFIG);
  t.ok(configs);
  t.equal(configs.length, 0);
  t.end();
});

test('lib.makeNginxConfigs', (t) => {
  const testPageConfigs = [
    { from: 'test1', to: 'test1' },
    { from: 'test2a', to: 'test2b' },
  ];

  const { dockerConf, prodConf } = lib.makeNginxConfigs(testPageConfigs);
  t.ok(dockerConf);
  t.ok(prodConf);

  testPageConfigs.forEach((pc) => {
    const rewrite = `rewrite ^/${pc.from}(.*)$ https://${pc.to}.18f.gov$1;`;
    t.ok(prodConf.indexOf(rewrite) >= 0);
    t.ok(dockerConf.indexOf(rewrite) >= 0);
  });

  // lines that must be in the real nginx config but that are not
  // in the docker config
  const prodLines = [
    'port_in_redirect off;',
    'daemon off;',
    'error_log <%= ENV["APP_ROOT"] %>/nginx/logs/error.log;',
    'access_log <%= ENV["APP_ROOT"] %>/nginx/logs/access.log cloudfoundry;',
    'listen <%= ENV["PORT"] %>;',
  ];

  prodLines.forEach((line) => {
    t.ok(prodConf.indexOf(line) >= 0);
  });

  t.end();
});
