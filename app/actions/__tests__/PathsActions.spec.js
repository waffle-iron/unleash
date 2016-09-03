/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import * as PathsActions from '../PathsActions';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import config from '../../config/routes';

describe('Path Actions', () => {

  it('should create an action for pathsListSuccess', () => {
    const paths = '/unleash/paths';
    const expectedAction = {
      type: PathsActions.PATHS_LIST_SUCCESS,
      paths
    };
    expect(PathsActions.pathsListSuccess(paths)).to.deep.equal(expectedAction);
  });

  it('should create an action for pathsListFailure', () => {
    const errors = 'Oops an error!';
    const expectedAction = {
      type: PathsActions.PATHS_LIST_FAILURE,
      errors
    };
    expect(PathsActions.pathsListFailure(errors)).to.deep.equal(expectedAction);
  });

  describe('Dispatch Actions', () => {
    const middlewares = [thunk];
    const store = configureStore(middlewares)();
    const dispatch = store.dispatch;

    afterEach(() => {
      store.clearActions();
      nock.cleanAll();
    });

    it('should call the dispatcher for pathsList', () => {
      const userId = 150;
      const hostname = 'http://paths.unleash.x-team.com';
      const path = `/api/v1/paths.json?userId=${userId}`;

      const httpResponse = generate('path', 15, userId);
      const requestCall = nock(hostname).get(path).reply(200, httpResponse);

      const expectedActions = [
        {type: 'PATHS_LIST'},
        PathsActions.pathsListSuccess(httpResponse)
      ];

      return dispatch(PathsActions.pathsList(userId)).then(() => {
        expect(requestCall.isDone()).to.be.true;
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
    });

  });

});
