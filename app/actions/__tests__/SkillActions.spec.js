/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import * as SkillActions from '../SkillActions';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import config from '../../config/routes';

describe('Skill Actions', () => {

  it('should create an action for skillListSuccess', () => {
    const skills = '/unleash/paths';
    const expectedAction = {
      type: SkillActions.SKILL_LIST_SUCCESS,
      skills
    };
    expect(SkillActions.skillListSuccess(skills)).to.deep.equal(expectedAction);
  });

  it('should create an action for skillListFailure', () => {
    const errors = 'Oops an error!';
    const expectedAction = {
      type: SkillActions.SKILL_LIST_FAILURE,
      errors
    };
    expect(SkillActions.skillListFailure(errors)).to.deep.equal(expectedAction);
  });

  describe('Dispatch Actions', () => {
    const middlewares = [thunk];
    const store = configureStore(middlewares)();
    const dispatch = store.dispatch;

    afterEach(() => {
      store.clearActions();
      nock.cleanAll();
    });

    it('should call the dispatcher for skillList', () => {
      const hostname = 'http://skills.unleash.x-team.com';
      const path = '/api/v1/skills.json';

      const httpResponse = generate('skill', 15);
      const requestCall = nock(hostname).get(path).reply(200, httpResponse);

      const expectedActions = [
        {type: 'SKILL_LIST'},
        SkillActions.skillListSuccess(httpResponse)
      ];

      return dispatch(SkillActions.skillList()).then(() => {
        expect(requestCall.isDone()).to.be.true;
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
    });

  });

});
