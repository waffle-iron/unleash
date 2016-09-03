/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { keyBy, random, forEach, keys } from 'lodash';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import { Paths } from '../Path';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('Path Component', () => {

  const createProfileWithKey = () => {
    const profiles = generate('profile', 3);
    const keyProfiles = {};
    forEach(profiles, profile => {
      keyProfiles[profile.username] = profile;
    });
    return keyProfiles;
  };

  const profiles = createProfileWithKey();
  const key = keys(profiles)[0];
  const paths = generate('path', 5, profiles[key].id);
  const location = {
    pathname: `/profiles/${profiles[key].username}`
  };
  let component;
  let mockedActions;
  let pathsListSpy;
  let routerSpy;

  beforeEach(() => {
    pathsListSpy = sinon.spy();
    routerSpy = sinon.spy();
    mockedActions = {
      pathsList: pathsListSpy,
    };
    const context = {
      router: {
        push: routerSpy,
      },
      muiTheme: getMuiTheme()
    };
    const childContextTypes = {
      muiTheme: React.PropTypes.object
    };

    component = mount(
      <Paths
        profiles={profiles}
        actions={mockedActions}
        paths={paths}
        location={location}
      />,
      {
        context,
        childContextTypes
      });
  });

  it('renders without problems', () => {
    expect(component).to.exist;
  });

  it('renders the list of paths', () => {
    const pathItems = component.find('Subheader');
    expect(pathItems.length).to.equal(paths.length);
  });

  it('renders the list of goals', () => {
    const goalsItems = component.find('ListItem');
    let goalsLength = 0;
    forEach(paths, path => {
      goalsLength += path.goals.length;
    });
    expect(goalsItems.length).to.equal(goalsLength);
  });

});
