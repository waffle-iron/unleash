/**
 * Unleash | PathContainer.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import * as PathsActions from '../actions/PathsActions';
import Paths from '../components/Path';

function mapStateToProps(state) {
  return {
    paths: state.paths,
    profiles: state.profiles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(PathsActions, dispatch),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Paths));
