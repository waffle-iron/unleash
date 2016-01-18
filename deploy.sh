#! /bin/bash
set -ev

TAG=$1
if [ "$TRAVIS_BRANCH" == 'develop' ]; then
    export UNLEASH_ENV='staging'
else
    export UNLEASH_ENV='production'
fi
grunt build
docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t xteam/unleash:$TAG .
docker push xteam/unleash
