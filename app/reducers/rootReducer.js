import { combineReducers } from 'redux';
import skillsReducer from './skillsReducer';
import profilesReducer from './profilesReducer';

const rootReducer = combineReducers({
  skills: skillsReducer,
  profiles: profilesReducer
});

export default rootReducer;
