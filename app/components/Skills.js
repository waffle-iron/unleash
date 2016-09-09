import React, { Component } from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

class Skills extends Component {
  componentDidMount() {
    this.props.actions.skillList();
  }

  handleSkillSelect(skillName) {
    this.props.router.push(`/skills/${skillName}`);
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
  router: React.PropTypes.object.isRequired,
};

export default Skills;
