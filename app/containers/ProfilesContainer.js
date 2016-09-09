/**
 * Unleash | ProfilesContainer.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as ProfileActions from '../actions/ProfileActions';
import Profiles from '../components/Profiles';

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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Profiles));
