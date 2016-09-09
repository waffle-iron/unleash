import React from 'react';
import UnleashApp from '../components/UnleashApp';
import ProfilesContainer from '../containers/ProfilesContainer';
import PathContainer from '../containers/PathContainer';
import SkillsContainer from '../containers/SkillsContainer';
import SkillContainer from '../containers/SkillContainer';
import GoalsContainer from '../containers/GoalsContainer';
import { Route } from 'react-router';

export default (
  <Route path="/" component={UnleashApp}>
    <Route path="/profiles" component={ProfilesContainer} />
    <Route path="/profiles/:username" component={PathContainer} />
    <Route path="/skills" component={SkillsContainer} />
    <Route path="/skills/:name" component={SkillContainer} />
    <Route path="/goals" component={GoalsContainer} />
  </Route>
);
