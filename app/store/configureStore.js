import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/rootReducer';

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware);
}
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
