import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ActionGrade from 'material-ui/svg-icons/action/grade';

class Menu extends Component {
  handleMenuClick(path) {
    this.context.router.push(path);
  }
  render() {
    return (
      <Drawer docked>
        <AppBar
          title="UNLEASH"
        />
        <MenuItem
          leftIcon={<ActionHome />}
          onTouchTap={() => this.handleMenuClick('/')}
        >
          Home
        </MenuItem>
        <MenuItem
          leftIcon={<ActionAccountCircle />}
          onTouchTap={() => this.handleMenuClick('/')}
        >
          My Path
        </MenuItem>
        <MenuItem
          leftIcon={<ActionSupervisorAccount />}
          onTouchTap={() => this.handleMenuClick('/paths')}
        >
          Paths
        </MenuItem>
        <MenuItem
          leftIcon={<ActionDashboard />}
          onTouchTap={() => this.handleMenuClick('/goals')}
        >
          Goals
        </MenuItem>
        <MenuItem
          leftIcon={<ActionGrade />}
          onTouchTap={() => this.handleMenuClick('/skills')}
        >
          Skills
        </MenuItem>
      </Drawer>
    );
  }
}

Menu.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Menu;
