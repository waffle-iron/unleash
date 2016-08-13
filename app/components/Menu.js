import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MaterialUIMenu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import { blueGrey50, blueGrey800 } from 'material-ui/styles/colors';
import LogoImg from '../assets/logo.png';

const styles = {
  titleBar: {
    fontStyle: 'italic',
    fontWeight: '600',
  },
  drawer: {
    backgroundColor: blueGrey800,
    boxShadow: 'none',
  },
  menuItem: {
    color: blueGrey50,
    fontSize: 14,
  },
};

class Menu extends Component {
  handleMenuClick(path) {
    this.context.router.push(path);
  }

  render() {
    const unleashLogo = <img src={LogoImg} alt="Unleash" width="40" />;
    const iconProps = { color: blueGrey50 };
    return (
      <Drawer containerStyle={styles.drawer} docked>
        <AppBar
          title="UNLEASH"
          iconElementLeft={unleashLogo}
          titleStyle={styles.titleBar}
        />
        <MaterialUIMenu>
          <MenuItem
            leftIcon={<ActionHome {...iconProps} />}
            onTouchTap={() => this.handleMenuClick('/')}
            style={styles.menuItem}
          >
            Home
          </MenuItem>
          <MenuItem
            leftIcon={<ActionAccountCircle {...iconProps} />}
            onTouchTap={() => this.handleMenuClick('/')}
            style={styles.menuItem}
          >
            My Path
          </MenuItem>
          <MenuItem
            leftIcon={<ActionSupervisorAccount {...iconProps} />}
            onTouchTap={() => this.handleMenuClick('/paths')}
            style={styles.menuItem}
          >
            Paths
          </MenuItem>
          <MenuItem
            leftIcon={<ActionDashboard {...iconProps} />}
            onTouchTap={() => this.handleMenuClick('/goals')}
            style={styles.menuItem}
          >
            Goals
          </MenuItem>
          <MenuItem
            leftIcon={<ActionGrade {...iconProps} />}
            onTouchTap={() => this.handleMenuClick('/skills')}
            style={styles.menuItem}
          >
            Skills
          </MenuItem>
        </MaterialUIMenu>
      </Drawer>
    );
  }
}

Menu.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Menu;
