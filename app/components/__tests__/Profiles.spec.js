/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { keyBy } from 'lodash';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import { Profiles } from '../Profiles';

describe('Profiles List', () => {
  let component;
  const profiles = generate('profile', 15);
  const mockedProfiles = keyBy(profiles, 'username');
  let mockedActions;

  beforeEach(() => {
    mockedActions = {
      profileList: sinon.spy(),
    };
    const context = {
      router: {
        push: () => {},
      },
    };
    component = shallow(<Profiles profiles={mockedProfiles} actions={mockedActions} />, { context });
  });

  it('renders without problems', () => {
    expect(component).to.exist;
  });

  it('renders the list of profiles', () => {
    const listItems = component.find('ListItem');
    expect(listItems.length).to.equal(profiles.length);
  });
});
