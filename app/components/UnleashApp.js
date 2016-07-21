import React from 'react';
import Menu from './Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red600, blueGray800} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  appBar: {
    color: red600
  }
});

class UnleashApp extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Menu />
          {children}
        </div>
      </MuiThemeProvider>
    )
  }
};

export default UnleashApp;
