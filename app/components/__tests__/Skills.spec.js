import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { keyBy } from 'lodash';
import generate from '../../testUtils/fixtures';
import { Skills } from '../Skills';

describe('Skills List', function () {
    let component;
    const mockedSkills = keyBy(generate('skill', 15), 'name');
    let mockedActions;

    beforeEach(function() {
        mockedActions = {
            skillList: sinon.spy()
        };
        component = shallow(
          <Skills skills={mockedSkills} actions={mockedActions} />
        );
    });

    it('renders without problems', function () {
        // expect(component).toExist();
    });

});