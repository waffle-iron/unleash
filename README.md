# Unleash your path

A project dedicated to help X-Teamers grow and see a progress they make along the way.

[![Build Status](https://travis-ci.org/x-team/unleash.svg?branch=master)](https://travis-ci.org/x-team/unleash)
[![devDependency Status](https://david-dm.org/x-team/unleash/dev-status.svg)](https://david-dm.org/x-team/unleash#info=devDependencies)

## Requirements

Basically, you need to install:
- [Docker Toolbox](https://www.docker.com/docker-toolbox)
- [docker-machine-nfs](https://github.com/adlogix/docker-machine-nfs#install)

If you're using OS X run the "Docker Quickstart Terminal" application which will create a default Virtual Machine for Docker.

Once in the terminal type:
```
docker-machine-nfs default
```
This will enable NFS on your Docker default Virtual Machine.

Also type:
```
docker-machine ip default
```
This will display the ip you need to add to your `/etc/hosts`
Given `192.168.99.100` is your machines ip add a line like this to your `/etc/hosts`:
```
192.168.99.100 unleash.dev
```

## Setup

### Install dependencies

In order to install node & bower dependencies run the command (it might take a while but it's one-time only):
```
docker-compose run web npm install && bower install --allow-root
```

### Running

In the Docker Quickstart Terminal go to the application folder and type:
```
docker-compose up
```

Wait for Docker to run the application.

Once the application is running and the "watch" task is in a waiting state you can access it at [http://unleash.dev](http://unleash.dev).

Remember to edit your configuration in `app/scripts/constants.js`!

### Running as daemon

Optionally you can also run the application as a daemon. Just type:

```
docker-compose up -d
```
If you'd like to see if it's running properly just type
```
docker-compose logs
```

### Accessing the container

If you want to get into the container with running application just type:
```
docker-compose run web bash
```

## Running tests

Unit tests use Karma, Mocha, Chai and Sinon.JS.

```
docker-compose run web grunt test
```

## Running the dist version

In order to create the dist version run

```
docker-compose run web grunt build
```

Then start the containers with `docker-compose up` and you can access the dist version on port `81` [http://unleash.dev:81](http://unleash.dev:81)

## Deployments

The project is beying deployed to 2 environments:
- Production: https://unleash.x-team.com
- Staging: https://staging.unleash.x-team.com

Please note that only Gmail accounts with `x-team.com` domain are accepted for registration.

## Coding Standards

* CSS: http://bem.info/method/
* Angular.js: https://github.com/johnpapa/angularjs-styleguide

## Feedback

Feel free to open an issue or contact these people directly:

- Product owner: Kuba Dobranowski, <kuba@x-team.com>
- Developer: Wojtek Zając, <wojtek@x-team.com>
