import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SkillActions from '../actions/SkillActions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

export class Skills extends Component {
  componentDidMount() {
    this.props.actions.skillList();
  }

  handleSkillSelect(skillName) {
    this.context.router.push(`/skills/${skillName}`);
  }

  render() {
    const { skills } = this.props;
    return (
      <List>
        {Object.keys(skills).map(skill => (
          <ListItem
            key={skills[skill].id}
            primaryText={skill}
            onTouchTap={() => this.handleSkillSelect(skill)}
          />
        ))}
      </List>
    );
  }
}

Skills.propTypes = {
  actions: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired,
};

Skills.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    skills: state.skills,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SkillActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Skills);
