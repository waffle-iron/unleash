[![Stories in Ready](https://badge.waffle.io/x-team/unleash.png?label=ready&title=Ready)](https://waffle.io/x-team/unleash)
# Unleash your path

A project dedicated to help X-Teamers grow and see a progress they make along the way.

[![Build Status](https://travis-ci.org/x-team/unleash.svg?branch=master)](https://travis-ci.org/x-team/unleash)
[![dependencies Status](https://david-dm.org/x-team/unleash/status.svg)](https://david-dm.org/x-team/unleash)
[![devDependency Status](https://david-dm.org/x-team/unleash/dev-status.svg)](https://david-dm.org/x-team/unleash#info=devDependencies)

## Requirements

Basically, you need to install:
- [Docker](https://www.docker.com)

(Note: if you're using OS X and install Docker Toolbox with Docker Machine webpack's liverload won't probably work - please install Docker For Mac to fully utilize webpack's livereloading)

## Setup

### Install dependencies

In order to install node & bower dependencies run the command (it might take a while but it's one-time only):
```
docker-compose run web npm install
```

### Config

Copy the configuration and apply your changes:
```
cp config.dist.js config.js
```

### Running

In the Docker Quickstart Terminal go to the application folder and type:
```
docker-compose up
```

Wait for Docker to run the application.

Once the application is running you can access it at [localhost](http://localhost)

### Running as daemon

Optionally you can also run the application as a daemon. Just type:

```
docker-compose up -d
```
If you'd like to see if it's running properly just type
```
docker-compose logs -ft
```

### Accessing the container

If you want to get into the container with running application just type:
```
docker-compose run web bash
```

### Testing

In order to run tests please type:
```
docker-compose run web npm run test
```

In order to run lint please type:
```
docker-compose run web npm run test:lint
```
