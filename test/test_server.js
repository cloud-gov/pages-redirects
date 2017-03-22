const request = require('request');
const test = require('tape');
const argv = require('minimist')(process.argv.slice(2));

const HOST = argv.host || 'http://localhost:8080';

test('host is running', (t) => {
  request(HOST, (err, res, body) => {
    t.notOk(err);

    // TODO: should we have a default index.html that says "ok" or something?
    t.equal(res.statusCode, 404);
    t.ok(body.indexOf('nginx'));
    t.end();
  });
});
