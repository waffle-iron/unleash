/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import * as ProfileActions from '../ProfileActions';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import config from '../../config/routes';

describe('Profile Actions', () => {

  it('should create an action for profileListSuccess', () => {
    const profiles = '/unleash/paths';
    const expectedAction = {
      type: ProfileActions.PROFILE_LIST_SUCCESS,
      profiles
    };
    expect(ProfileActions.profileListSuccess(profiles)).to.deep.equal(expectedAction);
  });

  it('should create an action for profileListFailure', () => {
    const errors = 'Oops an error!';
    const expectedAction = {
      type: ProfileActions.PROFILE_LIST_FAILURE,
      errors
    };
    expect(ProfileActions.profileListFailure(errors)).to.deep.equal(expectedAction);
  });

  describe('Dispatch Actions', () => {
    const middlewares = [thunk];
    const store = configureStore(middlewares)();
    const dispatch = store.dispatch;

    afterEach(() => {
      store.clearActions();
      nock.cleanAll();
    });

    it('should call the dispatcher for profileList', () => {
      const hostname = 'https://txkaf3ohhf.execute-api.us-west-2.amazonaws.com';
      const path = '/prod/profiles';

      const httpResponse = generate('profile', 15);
      const requestCall = nock(hostname).get(path).reply(200, httpResponse);

      const expectedActions = [
        {type: 'PROFILE_LIST'},
        ProfileActions.profileListSuccess(httpResponse)
      ];

      return dispatch(ProfileActions.profileList()).then(() => {
        expect(requestCall.isDone()).to.be.true;
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
    });

  });

});
