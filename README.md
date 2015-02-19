# #Unleash your path

A project dedicated to help X-Teamers grow and see a progress they make along the way.

[![Build Status](https://travis-ci.org/x-team/unleash.svg?branch=master)](https://travis-ci.org/x-team/unleash)
[![devDependency Status](https://david-dm.org/x-team/unleash/dev-status.svg)](https://david-dm.org/x-team/unleash#info=devDependencies)

## Setup

Make sure that you have the newest version of `Compass` in your system.

```
sudo gem update
```

Install required dependencies:

```
npm install && bower install
```

Run a local server:

```
grunt serve
```

Browse to the app at `http://localhost:9000`.

## Running tests

### Unit

Unit tests use Karma, Mocha, Chai and Sinon.JS.

```
grunt test
```

### End to end

E2E tests use Protractor, Mocha, Chai and Chai as Promised.

```
grunt test:e2e
```

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
