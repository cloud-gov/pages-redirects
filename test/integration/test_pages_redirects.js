const fs = require('fs');
const path = require('path');
const request = require('request');
const test = require('tape');

const lib = require('../../lib');

const HOST = process.env.TARGET_HOST || 'http://localhost:8080';
const PAGES_FILE = path.join(__dirname, '../..', 'pages.yml');

function internalRedirectOk(t, res, internalPath) {
  t.equal(res.statusCode, 302);
  t.equal(res.headers.location, `${HOST.replace('https', 'http')}/${internalPath}`);
}

test('redirects "/" to guides.18f.gov', (t) => {
  const reqObj = { url: HOST, followRedirect: false };
  request(reqObj, (err, res) => {
    t.notOk(err);
    t.equal(res.statusCode, 302);
    t.equal(res.headers.location, 'https://guides.18f.gov');
    t.end();
  });
});

const pageConfigs = lib.getPageConfigs(fs.readFileSync(PAGES_FILE, 'utf-8'));
pageConfigs.forEach((pc) => {
  test(`redirect "pages/${pc.from}" to "${pc.to}.18f.gov" works`, (t) => {
    const reqObj = {
      url: `${HOST}/${pc.from}`,
      followRedirect: false,
    };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${pc.to}.18f.gov`);
      t.end();
    });
  });

  test(`redirect "pages/${pc.from}/subpath" to "${pc.to}.18f.gov/subpath" works`, (t) => {
    const reqObj = { url: `${HOST}/${pc.from}/subpath`, followRedirect: false };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${pc.to}.18f.gov/subpath`);
      t.end();
    });
  });
});

test('proxy_pass for non-migrated pages works', (t) => {
  const reqObj = { url: `${HOST}/non-migrated-page`, followRedirect: false };
  request(reqObj, (err, res) => {
    t.notOk(err);
    internalRedirectOk(t, res, 'non-migrated-page/');
    t.end();
  });
});
