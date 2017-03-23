const path = require('path');
const request = require('request');
const test = require('tape');

const lib = require('../../lib');

const HOST = process.env.TARGET_HOST || 'http://localhost:8080';
const PAGES_FILE = path.join(__dirname, '../..', 'pages.yml');

test('host is running', (t) => {
  request(HOST, (err, res, body) => {
    t.notOk(err);
    t.equal(res.statusCode, 404);
    t.ok(body.indexOf('nginx'));
    t.end();
  });
});

const pageConfigs = lib.getPageConfigs(PAGES_FILE);
pageConfigs.forEach((pc) => {
  test(`redirect "${pc.from}" to "${pc.to}" works`, (t) => {
    const reqObj = { url: `${HOST}/${pc.from}`, followRedirect: false };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${pc.to}.18f.gov`);
      t.end();
    });
  });
});
