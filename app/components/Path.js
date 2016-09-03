/**
 * Unleash | Path.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import React, { Component } from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader';
import * as _ from 'lodash';

class Paths extends Component {
  componentDidMount() {
    const { profiles, actions } = this.props;
    // @TODO: (Kelvin De Moya) - Refactor when username API endpoint is ready.
    const currentUsername = _.chain(this.props.location.pathname)
                              .split('/')
                              .last()
                              .value();
    const currentUserObject = profiles[currentUsername];

    actions.pathsList(currentUserObject.id);
  }

  renderGoals(goals) {
    return _.map(goals, (goal) =>
      <ListItem
        key={goal.id}
        primaryText={goal.name}
      />
    );
  }

  renderPath(path) {
    return (
      <div key={path.id}>
        <Subheader>{path.name || 'Default'}</Subheader>
        {this.renderGoals(path.goals)}
      </div>
    );
  }

  render() {
    const { paths } = this.props;
    return (
      <List>
        {_.map(paths, (path) => this.renderPath(path))}
      </List>
    );
  }
}

Paths.propTypes = {
  actions: React.PropTypes.object.isRequired,
  paths: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  profiles: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
};

export default Paths;
