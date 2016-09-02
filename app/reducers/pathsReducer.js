/**
 * Unleash | pathsReducer.js
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import { PATHS_LIST_SUCCESS, PATHS_LIST_FAILURE } from '../actions/PathsActions';

function pathsReducer(paths = {}, action) {
  Object.freeze(paths);

  let newPaths;

  switch (action.type) {
    case PATHS_LIST_SUCCESS:
      newPaths = [];
      action.paths.forEach((path) => {
        if (path.goals.length) {
          newPaths.push(path);
        }
      });
      return newPaths;
    case PATHS_LIST_FAILURE:
      return {};
    default:
      return paths;
  }
}

export default pathsReducer;
