const path = require('path');
const test = require('tape');

const lib = require('../lib');

const PAGES_FILE = path.join(__dirname, 'test_pages_config.yml');

test('lib.getPageConfigs', (t) => {
  // TODO: Test with a
  const configs = lib.getPageConfigs(PAGES_FILE);
  t.ok(configs);
  t.equal(configs.length, 3);
  t.same(configs[0], { to: 'test1', from: 'test1' });
  t.same(configs[1], { to: 'test2', from: 'test2' });
  t.same(configs[2], { to: 'test3to', from: 'test3from' });

  t.end();
});
