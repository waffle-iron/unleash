/**
 * Unleash | GoalsContainer.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Goals from '../components/Goals';

function mapStateToProps(state) {
  return {
    goals: state.goals,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dispatch),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Goals));
