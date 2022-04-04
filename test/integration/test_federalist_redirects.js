
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
  { from: 'apply.pif.gov', to: 'presidentialinnovationfellows.gov/apply', noPath: true },
  { from: '18f.gov', to: '18f.gsa.gov' },
  { from: 'www.18f.gov', to: '18f.gsa.gov' },
  { from: 'digitalgov.gov', to: 'digital.gov', redirectCode: 301 },
  { from: 'www.digitalgov.gov', to: 'digital.gov', redirectCode: 301 },
  { from: 'www.digital.gov', to: 'digital.gov', redirectCode: 301 },
  { from: 'summit.digitalgov.gov', to: 'digital.gov' },
  { from: 'plainlanguage.gov', to: 'www.plainlanguage.gov', redirectCode: 301 },
  { from: 'openopps.digitalgov.gov', to: 'openopps.usajobs.gov', redirectCode: 301 },
  { from: 'blogging-guide.18f.gov', to: 'handbook.18f.gov/blogging', redirectCode: 301, noPath: true },
  { from: 'v2.designsystem.digital.gov', to: 'designsystem.digital.gov', redirectCode: 301 },
  { from: 'www.findtreatment.gov', to: 'findtreatment.gov', redirectCode: 301 },
  { from: 'handbook.18f.gov', to: 'handbook.tts.gsa.gov', redirectCode: 301 },
  { from: 'frontend.18f.gov', to: 'engineering.18f.gov/frontend', redirectCode: 301, noPath: true },
  { from: 'www.search.gov', to: 'search.gov', redirectCode: 301 },
  { from: 'usability.gov', to: 'www.usability.gov', redirectCode: 301 },
  { from: 'emerging.digital.gov', to: 'digital.gov/topics/emerging-tech', redirectCode: 301, noPath: true },
  { from: 'components.designsystem.digital.gov', to: 'designsystem.digital.gov/components', redirectCode: 301, noPath: true },
];

function redirectOk(t, from, to, redirectCode) {
  request({ url: `${PROTOCOL}://${from}`, followRedirect: false }, (err, res) => {
    t.notOk(err);
    t.ok(res);
    t.equal(res.statusCode, redirectCode);
    t.equal(res.headers.location, `https://${to}`);
    t.end();
  });
}

expectedRedirects.forEach((expected) => {
  // default to expecting a 302 redirect
  const redirectCode = expected.redirectCode || 302;

  test(`redirects ${expected.from} to ${expected.to} (${redirectCode})`, (t) => {
    redirectOk(t, expected.from, `${expected.to}/`, redirectCode);
  });

  if (!expected.noPath) {
    test(`redirects ${expected.from}/boop to ${expected.to}/boop (${redirectCode})`, (t) => {
      redirectOk(t, `${expected.from}/boop`, `${expected.to}/boop`, redirectCode);
    });
  }
});
