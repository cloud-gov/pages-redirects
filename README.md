# pages-redirects

[![Build Status](https://travis-ci.org/18F/pages-redirects.svg?branch=master)](https://travis-ci.org/18F/pages-redirects)

**UNDER DEVELOPMENT**

Redirects traffic from previous pages.18f.gov sites to their new URLs.

## Adding a new redirect

To add a new redirect from a retired pages.18f.gov to its new subdomain home,
you will need to edit [`pages.yml`](/pages.yml). Please open a Pull Request with
your modifications.

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

## Usage

This project uses [`yarn`](https://yarnpkg.com/) for managing node dependencies.
After making sure you have it installed, run `yarn` to install dependencies.

Run `make` to build nginx configs, which will be written to the `out/` directory.

## Testing

To run unit tests, run `npm test`.

To run integration tests, you'll need to build and run this repo's docker container.

First make sure you have [Docker][] and [Docker Compose][] installed, and maybe
give the [18F Docker guide][] a read.

```sh
make docker
docker-compose up -d
```

Then you can run the tests with:

```sh
npm run test-docker
```

Once you are finished testing, stop your detached dockers with:

```
docker-compose stop
```

## Deploying

This app will be deployed in GovCloud cloud.gov:

org: `gsa-18f-federalist`
space: `redirects`


To manually deploy:

```sh
make
cf push -f manifests/manifest-<target>.yml`
```

[18F Docker guide]: https://pages.18f.gov/dev-environment-standardization/virtualization/docker/
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
