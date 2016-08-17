import React from 'react';
import UnleashApp from '../components/UnleashApp';
import Profiles from '../components/Profiles';
import Path from '../components/Path';
import Skills from '../components/Skills';
import Skill from '../components/Skill';
import Goals from '../components/Goals';
import { Route } from 'react-router';

export default (
  <Route path="/" component={UnleashApp}>
    <Route path="/profiles" component={Profiles} />
    <Route path="/profiles/:username" component={Path} />
    <Route path="/skills" component={Skills} />
    <Route path="/skills/:name" component={Skill} />
    <Route path="/goals" component={Goals} />
  </Route>
);
