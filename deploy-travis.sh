#!/bin/bash

# CF_USER and CF_PASS are defined as private Environment Variables
# in the Travis web UI: https://travis-ci.org/18F/pages-redirects/settings

set -eu

API="https://api.fr.cloud.gov"
ORG="gsa-18f-federalist"
SPACE="redirects"
APP_NAME="pages-redirects"
MANIFEST="manifests/manifest-prod.yml"

cf login -a $API -u $CF_USER -p $CF_PASS -o $ORG -s $SPACE
cf zero-downtime-push $APP_NAME -f $MANIFEST
