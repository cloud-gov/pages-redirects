#!/bin/bash

# CF_USER and CF_PASS are defined as private Environment Variables
# in the Circle web UI: https://circleci.com/gh/18F/pages-redirects/edit#env-vars

set -eu

API="https://api.fr.cloud.gov"
ORG="gsa-18f-federalist"
SPACE="redirects"
APP_NAME="pages-redirects"
MANIFEST="out/manifest-prod.yml"

cf login -a $API -u $CF_USER -p $CF_PASS -o $ORG -s $SPACE
cf zero-downtime-push $APP_NAME -f $MANIFEST
