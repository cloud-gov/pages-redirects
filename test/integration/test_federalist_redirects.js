
const request = require('request');
const test = require('tape');

// If we have a specified TARGET_HOST env var that starts with 'https' then we
// are testing against a live server, which should be using https.
// Otherwise, we're testing against either localhost or our docker-compose setup,
// which will over plain http.
const PROTOCOL = process.env.TARGET_HOST && process.env.TARGET_HOST.startsWith('https')
  ? 'https' : 'http';

const expectedRedirects = [
  { from: 'pif.gov', to: 'presidentialinnovationfellows.gov' },
  { from: 'www.pif.gov', to: 'presidentialinnovationfellows.gov' },
  { from: 'connect.gov', to: 'login.gov' },
  { from: 'www.connect.gov', to: 'login.gov' },
  { from: '18f.gov', to: '18f.gsa.gov' },
  { from: 'www.18f.gov', to: '18f.gsa.gov' },
  { from: 'app.gov', to: 'apps.gov' },
  { from: 'www.app.gov', to: 'apps.gov' },
  { from: 'jobs.18f.gov', to: 'join.18f.gov' },
  { from: 'join.18f.gov', to: '18f.gsa.gov/join', noPath: true },
];

function redirectOk(t, from, to) {
  request({ url: `${PROTOCOL}://${from}`, followRedirect: false }, (err, res) => {
    t.notOk(err);
    t.ok(res);
    t.equal(res.statusCode, 301);
    t.equal(res.headers.location, `https://${to}`);
    t.end();
  });
}

expectedRedirects.forEach((expected) => {
  test(`redirects ${expected.from} to ${expected.to}`, (t) => {
    redirectOk(t, expected.from, `${expected.to}/`);
  });

  if (!expected.noPath) {
    test(`redirects ${expected.from}/boop to ${expected.to}/boop`, (t) => {
      redirectOk(t, `${expected.from}/boop`, `${expected.to}/boop`);
    });
  }
});
