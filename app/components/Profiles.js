import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ProfileActions from '../actions/ProfileActions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

export class Profiles extends Component {
  componentDidMount() {
    this.props.actions.profileList();
  }

  handleProfileSelect(username) {
    this.context.router.push(`/profiles/${username}`);
  }

  render() {
    const { profiles } = this.props;
    return (
      <List>
        {Object.keys(profiles).map(username => (
          <ListItem
            key={profiles[username].id}
            primaryText={profiles[username].fullName}
            onTouchTap={() => this.handleProfileSelect(username)}
          />
        ))}
      </List>
    );
  }
}

Profiles.propTypes = {
  actions: React.PropTypes.object.isRequired,
  profiles: React.PropTypes.object.isRequired,
};

Profiles.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    profiles: state.profiles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProfileActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profiles);
