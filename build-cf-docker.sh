#!/bin/bash
set -e

# Use a specific revision sha/branch/tag that is known to work since
# cf-dockerized-buildpack is under development
TARGET_REVISION=f3c07fcf09ca913850cd8f81dde4e993b0d1ab27

CLONE_DIR=.build/cf-dockerized-buildpack

if [ ! -d "$CLONE_DIR" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "-- Cloning 18F/cf-dockerized-buildpack to $CLONE_DIR."
  git clone https://github.com/18F/cf-dockerized-buildpack.git .build/cf-dockerized-buildpack
else
  echo "-- Found $CLONE_DIR, continuing."
fi

cd .build/cf-dockerized-buildpack

git checkout -q $TARGET_REVISION

echo "-- Building staticfile buildpack docker image."
./build.sh staticfile
