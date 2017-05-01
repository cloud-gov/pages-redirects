const test = require('tape');
const yaml = require('js-yaml');

const lib = require('../../lib');

const PAGES_CONFIG = [
  '---',
  '- test1',
  '- test2',
  '- from: test3from',
  '  to: test3to',
  '- from: test4from',
  '  to: test4to',
  '  toDomain: anotherdomain.gov',
].join('\n');

const EMTPY_CONFIG = '---\n';

const TEST_PAGE_CONFIGS = [
  { from: 'test1', to: 'test1', toDomain: '18f.gov' },
  { from: 'test2a', to: 'test2b', toDomain: '18f.gov' },
  { from: 'test3a', to: 'test3b', toDomain: 'boop.gov' },
];

test('lib.getPageConfigs', (t) => {
  const configs = lib.getPageConfigs(PAGES_CONFIG);
  t.ok(configs);
  t.equal(configs.length, 4);
  t.same(configs[0], { to: 'test1', from: 'test1', toDomain: '18f.gov' });
  t.same(configs[1], { to: 'test2', from: 'test2', toDomain: '18f.gov' });
  t.same(configs[2], { to: 'test3to', from: 'test3from', toDomain: '18f.gov' });
  t.same(configs[3], { to: 'test4to', from: 'test4from', toDomain: 'anotherdomain.gov' });
  t.end();
});

test('lib.getPageConfigs with empty config', (t) => {
  const configs = lib.getPageConfigs(EMTPY_CONFIG);
  t.ok(configs);
  t.equal(configs.length, 0);
  t.end();
});

test('lib.makeNginxConfigs', (t) => {
  const { dockerConf, prodConf } = lib.makeNginxConfigs(TEST_PAGE_CONFIGS);
  t.ok(dockerConf);
  t.ok(prodConf);

  TEST_PAGE_CONFIGS.forEach((pc) => {
    const rewrite = `rewrite ^/${pc.from}(\\/.*)?$ https://${pc.to}.${pc.toDomain}$1;`;
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

test('lib.makeManifest produces correct routes', (t) => {
  const manifest = yaml.safeLoad(lib.makeManifest(TEST_PAGE_CONFIGS));
  t.ok(manifest);
  t.ok(Array.isArray(manifest.routes));

  const isInManifestRoutes = (pc) => {
    const route = `${pc.to}.${pc.toDomain}`;
    const res = manifest.routes.filter(r => r.route === route);
    t.equal(res.length, 1, `route for ${route} not found`);
  };

  TEST_PAGE_CONFIGS.forEach((pc) => {
    isInManifestRoutes(pc);
  });
  t.end();
});
