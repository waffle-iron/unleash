/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Goals from '../Goals';

describe('Goals List', () => {
  let component;

  beforeEach(() => {
    component = mount(<Goals />);
  });

  it('should render without problems', () => {
    expect(component).to.exist;
  });

});
