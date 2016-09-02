import { combineReducers } from 'redux';
import skillsReducer from './skillsReducer';
import profilesReducer from './profilesReducer';
import pathsReducer from './pathsReducer';

const rootReducer = combineReducers({
  skills: skillsReducer,
  profiles: profilesReducer,
  paths: pathsReducer
});

export default rootReducer;
