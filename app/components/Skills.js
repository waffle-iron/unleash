import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SkillActions from '../actions/SkillActions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

export class Skills extends React.Component {
  componentDidMount() {
    this.props.actions.skillList();
  }
  handleSkillSelect(skillName) {
    this.context.router.push('/skills/' + skillName);
  }
  render() {
    const { skills } = this.props;
    const skillLinks = [];
    for (const name in skills) {
      skillLinks.push(
        <ListItem
          key={skills[name].id}
          primaryText={name}
          onTouchTap={() => this.handleSkillSelect(name)}
        />
      );
    }
    return (
      <List>
        {skillLinks}
      </List>
    )
  }
};

Skills.propTypes = {
  actions: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired
};

Skills.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    skills: state.skills
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SkillActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Skills);
