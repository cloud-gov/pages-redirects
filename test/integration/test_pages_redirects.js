const fs = require('fs');
const path = require('path');
const request = require('request');
const test = require('tape');

const lib = require('../../lib');

const HOST = process.env.TARGET_HOST || 'http://localhost:8080';
const PAGES_FILE = path.join(__dirname, '../..', 'pages.yml');

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

const subdomainConfigs = pageConfigs.filter(pc => !pc.toDomain);
const customDomainConfigs = pageConfigs.filter(pc => pc.toDomain);

subdomainConfigs.forEach((pc) => {
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

customDomainConfigs.forEach((pc) => {
  test(`redirect "pages/${pc.from}" to "${pc.to}.${pc.toDomain}" works`, (t) => {
    const reqObj = {
      url: `${HOST}/${pc.from}`,
      followRedirect: false,
    };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${pc.to}.${pc.toDomain}${pc.toPath}`);
      t.end();
    });
  });

  test(`redirect "pages/${pc.from}/subpath" to "${pc.to}.${pc.toDomain}${pc.toPath}/subpath" works`, (t) => {
    const reqObj = { url: `${HOST}/${pc.from}/subpath`, followRedirect: false };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${pc.to}.${pc.toDomain}${pc.toPath}/subpath`);
      t.end();
    });
  });
});

[
  ['identity-intro', 'www.login.gov'],
  ['identity-playbook', 'www.login.gov/playbook'],
  ['identity-pii-management', 'www.login.gov/security'],
].forEach((config) => {
  const [from, to] = config;

  test(`redirect "pages/${from}" to "${to}"`, (t) => {
    const reqObj = { url: `${HOST}/${from}`, followRedirect: false };
    request(reqObj, (err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, `https://${to}`);
      t.end();
    });
  });
});

test('return error page for anything else', (t) => {
  const reqObj = { url: `${HOST}/non-migrated-page`, followRedirect: false };
  request(reqObj, (err, res) => {
    t.notOk(err);
    t.equal(res.statusCode, 404);
    t.ok(res.body.indexOf('federalist-support@gsa.gov') > -1, 'contains support email address');
    t.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    t.end();
  });
});
