import React, { PropTypes } from 'react';
import Menu from './Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red600 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  appBar: {
    color: red600,
  },
});

const UnleashApp = (props) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div>
      <Menu />
      {props.children}
    </div>
  </MuiThemeProvider>
);

UnleashApp.propTypes = {
  children: PropTypes.node,
};

export default UnleashApp;
