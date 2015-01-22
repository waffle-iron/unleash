# #Unleash your path

This is a work in progress. Things are subject to change.

[![Build Status](https://travis-ci.org/x-team/unleash.svg?branch=master)](https://travis-ci.org/x-team/unleash)

## TODO

1. Add more unit tests!
2. Don’t show higher card levels if level 1 hasn’t been started yet
3. Add notifications
4. Analyse all code against [Angular.js guidelines](#coding-standards) more closely
5. Write end to end tests

## Setup

Make sure that you have newest `Compass` in your system.

```
sudo gem update
```

Install required dependencies:

```
npm install && bower install
```

## Preview 

### Local environment

Run a local server:

```
grunt serve
```

Browse to the app at `http://localhost:9000`.

### Public version

The project is being deployed to https://unleash-app.firebaseapp.com.

## Testing

### Unit tests

Unit tests use Karma, Mocha, Chai and Sinon.JS.

```
npm run test:unit
```

### E2E tests

End to end tests use Protractor, Mocha, Chai and Chai as Promised.

```
npm run test:e2e
```

## Coding Standards

* CSS: http://bem.info/method/
* Angular.js: https://github.com/johnpapa/angularjs-styleguide
