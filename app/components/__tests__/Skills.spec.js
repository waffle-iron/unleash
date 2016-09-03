/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { keyBy, random } from 'lodash';
import sinon from 'sinon';
import generate from '../../testUtils/fixtures';
import { Skills } from '../Skills';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('Skills List', () => {
  let component;
  const skills = generate('skill', 15);
  const mockedSkills = keyBy(skills, 'name');
  let mockedActions;
  let skillListSpy;
  let routerSpy;

  beforeEach(() => {
    skillListSpy = sinon.spy();
    routerSpy = sinon.spy();
    mockedActions = {
      skillList: skillListSpy,
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

    component = mount(<Skills skills={mockedSkills} actions={mockedActions}/>,
      {
        context,
        childContextTypes
      });
  });

  it('renders without problems', () => {
    expect(component).to.exist;
  });

  it('renders the list of skills', () => {
    const listItems = component.find('ListItem');
    expect(listItems.length).to.equal(skills.length);
  });

  it('componentDidMount call the skillList fetch', () => {
    expect(skillListSpy.callCount).to.equal(1);
  });

  it('router push to skill view on handleSkillSelect', () => {
    const index = random(skills.length - 1);
    const skill = skills[index];
    const skillElement = component.find('Skills');
    skillElement.node.handleSkillSelect(skill.name);
    const expectedRoute = `/skills/${skill.name}`;
    expect(routerSpy.getCall(0).args[0]).to.equal(expectedRoute);
  });
});
