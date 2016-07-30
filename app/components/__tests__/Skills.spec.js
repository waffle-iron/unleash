import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import expect from 'expect';
import MockComponent from '../../testUtils/MockComponent';
import { Skills } from '../Skills';

describe('Skills List', function () {
    let component;

    beforeEach(function() {
        Skills.__Rewire__('List', MockComponent);
        Skills.__Rewire__('ListItem', MockComponent);
        component = renderIntoDocument(<Skills/>);
    });

    afterEach(function() {
        Skills.__ResetDependency__('List');
        Skills.__ResetDependency__('ListItem');
    });

    it('renders without problems', function () {
        expect(component).toExist();
    });
});