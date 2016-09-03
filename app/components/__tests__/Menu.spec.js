/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Menu from '../Menu';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('Menu Component', () => {
  let component;
  let routerSpy;

  beforeEach(() => {
    routerSpy = sinon.spy();
    const context = {
      router: {
        push: routerSpy,
      },
      muiTheme: getMuiTheme()
    };
    const childContextTypes = {
      muiTheme: React.PropTypes.object
    };

    component = mount(<Menu />,{ context, childContextTypes });
  });

  it('renders without problems', () => {
    expect(component).to.exist;
  });


  it('router push to new view on handleMenuClick', () => {
    const element = component.find('Menu');
    const expectedRoute = '/heroes/unleash';
    element.node.handleMenuClick(expectedRoute);
    expect(routerSpy.getCall(0).args[0]).to.equal(expectedRoute);
  });
});
