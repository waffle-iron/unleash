/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Skill from '../Skill';

describe('Goals List', () => {
  let component;

  beforeEach(() => {
    component = mount(<Skill />);
  });

  it('should render without problems', () => {
    expect(component).to.exist;
  });

});
