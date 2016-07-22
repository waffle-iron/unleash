import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './config/routes';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
);
