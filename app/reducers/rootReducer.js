import { combineReducers } from 'redux';
import skillsReducer from './skillsReducer';

const rootReducer = combineReducers({
  skills: skillsReducer,
});

export default rootReducer;
