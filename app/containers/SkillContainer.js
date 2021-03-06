/**
 * Unleash | SkillContainer.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as SkillActions from '../actions/SkillActions';
import Skill from '../components/Skill';

function mapStateToProps(state) {
  return {
    skill: state.skill,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SkillActions, dispatch),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Skill));
