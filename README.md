# pages-redirects

[![Build Status](https://travis-ci.org/18F/pages-redirects.svg?branch=master)](https://travis-ci.org/18F/pages-redirects)

**UNDER DEVELOPMENT**

Redirects traffic from previous pages.18f.gov sites to their new URLs.

## Adding a new redirect

To add a new redirect from a retired pages.18f.gov to its new subdomain home,
you will need to edit [`pages.yml`](/pages.yml). Please open a [Pull Request](https://github.com/18F/pages-redirects/pull/new/master)
with your modifications.

If you need to add a simple redirect of `pages.18f.gov/site-name` to `site-name.18f.gov`,
simply add a new line to the `pages.yml` that looks like:

```yml
- site-name
```

If you need to change the name of the old page to something new, like `pages.18f.gov/old-name` to `new-name.18f.gov`,
add lines of the following form to `pages.yml`:


```yml
- from: old-name
  to: new-name
```

Once your changes are merged into `master`, the `pages-redirects` app will be redeployed
by Travis and your redirects should start working within a few minutes.

## Developing

This project uses [`yarn`](https://yarnpkg.com/) for managing node dependencies.
After making sure you have it installed, run `yarn` to install dependencies.

## Testing

To run unit tests, run `npm test`.

### Integration Tests

#### Local Docker

You can run integration tests locally against a docker container.
First make sure you have [Docker][] and [Docker Compose][] installed, and maybe
give the [18F Docker guide][] a read.

Then build and run the docker container:

```sh
npm run build-docker
docker-compose up -d
```
Finally, run tests against it with:

```sh
npm run test-docker
```

Once you are finished testing, stop your detached dockers with:

```
docker-compose stop
```

#### Real server

To run integration tests against a real server:

```sh
TARGET_HOST=<FULL_URL_TOSERVER> npm run test-integration
```

For example:

```sh
TARGET_HOST=https://pages-redirects.app.cloud.gov npm run test-integration
```

## Deploying

This is deployed in GovCloud cloud.gov:

org: `gsa-18f-federalist`
space: `redirects`

### Automated Deployments

This app is automatically deployed by Travis when commits are pushed to the
`master` branch (such as from a merged Pull Request). Deployments are done with
the [cf-autopilot][] plugin so that there will be no downtime.

See [`.travis.yml`](/.travis.yml) and [`deploy-travis.sh`](/deploy-travis.sh) for details.

### Manual Deployments

To manually deploy:

```sh
npm run build-configs
cf push -f manifests/manifest-<target>.yml`
```

[18F Docker guide]: https://pages.18f.gov/dev-environment-standardization/virtualization/docker/
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[cf-autopilot]: https://github.com/contraband/autopilot
