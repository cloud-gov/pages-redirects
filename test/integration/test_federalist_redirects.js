// TODO: Finish these tests
// const request = require('request');
// const test = require('tape');
//
// const expectedRedirects = [
//   { from: 'pif.gov', to: 'presidentialinnovationfellows.gov' },
//   { from: 'www.pif.gov', to: 'presidentialinnovationfellows.gov' },
//   { from: 'login.gov', to: 'pages.18f.gov/identity-intro' },
//   { from: 'www.login.gov', to: 'pages.18f.gov/identity-intro' },
//   { from: 'connect.gov', to: 'login.gov' },
//   { from: 'www.connect.gov', to: 'login.gov' },
//   { from: '18f.gov', to: '18f.gsa.gov' },
//   { from: 'www.18f.gov', to: '18f.gsa.gov' },
//   // TODO: few more, and some have more complicated "to" props
// ];
//
// function redirectOk(t, from, to) {
//   request(`http://${from}`, (err, res) => {
//     t.notOk(err);
//     t.ok(res);
//     t.equal(res.request.uri.href, `https://${to}`);
//     t.end();
//   });
// }
//
// expectedRedirects.forEach((expected) => {
//   test(`redirects ${expected.from} to ${expected.to}`, (t) => {
//     redirectOk(t, expected.from, `${expected.to}/`);
//   });
//
//   test(`redirects ${expected.from}/boop to ${expected.to}/boop`, (t) => {
//     redirectOk(t, `${expected.from}/boop`, `${expected.to}/boop`);
//   });
// });
