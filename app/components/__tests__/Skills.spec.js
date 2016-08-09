import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { keyBy } from 'lodash';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import { Skills } from '../Skills';

describe('Skills List', () => {
  let component;
  const skills = generate('skill', 15);
  const mockedSkills = keyBy(skills, 'name');
  let mockedActions;

  beforeEach(() => {
    mockedActions = {
      skillList: sinon.spy(),
    };
    const context = {
      router: {
        push: () => {},
      },
    };
    component = shallow(<Skills skills={mockedSkills} actions={mockedActions} />, { context });
  });

  it('renders without problems', () => {
    expect(component).to.exist;
  });

  it('renders the list of skills', () => {
    const listItems = component.find('ListItem');
    expect(listItems.length).to.equal(skills.length);
  });

});
