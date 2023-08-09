# pages-redirects

[![CircleCI](https://circleci.com/gh/18F/pages-redirects.svg?style=svg)](https://circleci.com/gh/18F/pages-redirects)

This app redirects traffic from previous `pages.18f.gov` sites to their new URLs,
which are usually a subdomain of `18f.gov` (eg `pages.18f.gov/boop` → `boop.18f.gov`).

This app also contains a number of non-pages.18f.gov-related redirects that were
previously handled by [pages-redirects](https://github.com/18F/pages-redirects) for TTS in the 18F GitHub organziation. These redirect rules can be found in [`templates/_federalist-redirects.njk`](./templates/_federalist-redirects.njk).

## Adding a new redirect

### pages.18f.gov redirects
To add a new redirect from a retired pages.18f.gov to its new 18f.gov-subdomain home,
you will need to edit [`pages.yml`](/pages.yml). Please open a [Pull Request](https://github.com/18F/pages-redirects/pull/new/main)
with your modifications.

If you need to add a simple redirect of `pages.18f.gov/site-name` to `site-name.18f.gov`,
simply add a new line to the `pages.yml` that looks like:

```yml
- site-name
```

If you need to change the name of the old page to something new, like
`pages.18f.gov/old-name` to `new-name.18f.gov`,
add lines of the following form to `pages.yml`:

```yml
- from: old-name
  to: new-name
```

If you need to redirect to a _different domain_ from `18f.gov`, like
`pages.18f.gov/old-name` to `new-name.new-domain.gov`,
add lines of the following form to `pages.yml`:

```yml
- from: old-name
  to: new-name
  toDomain: new-domain.gov
```

Additionally you can redirect to a _custom path_ on that domain, like
`pages.18f.gov/old-name` to `new-name.new-domain.gov/custom-path`,
add lines of the following form to `pages.yml`:

```yml
- from: old-name
  to: new-name
  toDomain: new-domain.gov
  toPath: custom-path
```

### Domain redirects
To create a redirect for yourOrigDomain.gov to yourNewDomain.gov, perform the following steps:
1. Add a route for yourOrigDomain.gov in [`manifest-prod.yml.njk`](/templates/manifest-prod.yml.njk)
```
route: yourOrigDomain.gov
```
2. Add a redirect configuration in [`_federalist-redirects.njk`](/templates/_federalist-redirects.njk):
```
server {
  listen {{ PORT }};
  set $target_domain yourNewDomain.gov;
  server_name yourOrigDomain.gov;
  return 301 https://$target_domain;
}
```
3. Add yourOrigDomain.gov as an external link to [`docker-compose.yml`](/docker-compose.yml)
```
app:yourOrigDomain.gov
```
4. Test this app as described below in the `Testing` section
5. Create a pull request in the the [dns repository](https://github.com/18F/dns) to follow the [cloud.gov instructions](https://cloud.gov/docs/services/external-domain-service/#how-to-create-an-instance-of-this-service) to create the required DNS entries for `yourOrigDomain.gov` and ask @cloud-gov/pages-ops for a review.
6. Ask an administrator to create an [`external-domain`](https://cloud.gov/docs/services/external-domain-service/) for `yourOrigDomain.gov`.
```
cf create-service external-domain domain-with-cdn yourOrigDomain.gov -c '{"domains": "yourOrigDomain.gov"}'
```

Once your changes are merged into `main` by an administrator,
the `pages-redirects` app will be redeployed by CircleCI and your redirects
should start working within a few minutes.

## Developing

This is a NodeJS-based project that uses [`yarn`](https://yarnpkg.com/) for managing node dependencies.
After making sure you have it installed, run `yarn` to install dependencies.

The NodeJS code (called from [`build.js`](/build.js)) reads an array of sites to
redirect from the [`pages.yml`](/pages.yml) file and inserts new NGINX rewrite rules
into the [`nginx.conf.njk`](/templates/nginx.conf.njk) template in [`templates/`](/templates).
The resulting `nginx.conf` files (one for testing in [Docker](#local-docker) and one
for the production site) are written to the `out/` directory.
The build script also produces a CloudFoundry manifest file at `out/manifest-prod.yml` for deploying this app to cloud.gov.

## Testing

To run unit tests, run `yarn test`.

### Integration Tests

#### Local Docker

You can run integration tests locally against a Docker container.
First make sure you have [Docker][] and [Docker Compose][] installed, and maybe
give the [18F Docker guide][] a read.

Then build and run tests in the docker-compose network:

```sh
yarn build-docker && yarn test-docker
```

#### Real server

To run integration tests against a real server:

```sh
TARGET_HOST=<FULL_URL_TOSERVER> yarn test-integration
```

For example:

```sh
TARGET_HOST=https://pages-redirects.app.cloud.gov yarn test-integration
```

## Deploying

This is deployed in GovCloud cloud.gov:

- org: `gsa-18f-federalist`
- space: `redirects`

## CI Deployments
This repository contains one pipeline in concourse:
- [__Redirects__](./ci/pipeline.yml)

__Redirects__ deploys the Pages redirects app

#### Pipeline credentials
Concourse CI integrates directly with [Credhub](https://docs.cloudfoundry.org/credhub/) to provide access to credentials/secrets at job runtime. When a job is started, Concourse will resolve the parameters within the pipeline with the latest credentials using the double parentheses notation (ie. `((<credential-name>))`). See more about the [credentials lookup rules](https://concourse-ci.org/credhub-credential-manager.html#credential-lookup-rules).

Some credentials in this pipeline are "compound" credentials that use the pipeline's instance variable in conjuction with its parameterized variables to pull the correct Credhub credentials based on the pipeline instance. The following parameters are used in the proxy pipeline:

|Parameter|Description|Is Compound|
--- | --- | --- |
|**`((deploy-env))-cf-username`**|The deployment environments CloudFoundry deployer username based on the instanced pipeline|:white_check_mark:|
|**`((deploy-env))-cf-username`**|The deployment environments CloudFoundry deployer password based on the instanced pipeline|:white_check_mark:|
|**`((slack-channel))`**| Slack channel | :x:|
|**`((slack-username))`**| Slack username | :x:|
|**`((slack-icon-url))`**| Slack icon url | :x:|
|**`((slack-webhook-url))`**| Slack webhook url | :x:|
|**`((gh-access-token))`**| The Github access token|:x:|

##### Setting up the pipeline
The pipeline and each of it's instances will only needed to be set once per instance to create the initial pipeline. After the pipelines are set, updates to the respective `git-branch` source will automatically set the pipeline with any updates. See the [`set_pipeline` step](https://concourse-ci.org/set-pipeline-step.html) for more information. Run the following command with the fly CLI to set a pipeline instance:

```bash
$ fly -t <Concourse CI Target Name> set-pipeline -p redirects \
  -c ci/pipeline.yml
```

##### Getting or deleting a pipeline instance from the CLI
To get a pipeline instance's config or destroy a pipeline instance, Run the following command with the fly CLI to set a pipeline:

```bash
## Get a pipeline instance config
$ fly -t <Concourse CI Target Name> get-pipeline \
  -p redirects

## Destroy a pipeline
$ fly -t <Concourse CI Target Name> destroy-pipeline \
  -p redirects
```

### Manual Deployments

To manually deploy (this should not be necessary):

```sh
yarn build
cf push -f out/manifest-prod.yml`
```

[18F Docker guide]: https://pages.18f.gov/dev-environment-standardization/virtualization/docker/
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[cf-autopilot]: https://github.com/contraband/autopilot
