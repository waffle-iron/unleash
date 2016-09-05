/**
 * Unleash
 * @author X-Team 2016 <http://www.x-team.com>
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */

import config from '../../config';

export const PATHS_LIST = 'PATHS_LIST';
export const PATHS_LIST_SUCCESS = 'PATHS_LIST_SUCCESS';
export const PATHS_LIST_FAILURE = 'PATHS_LIST_FAILURE';

function doPathsList() {
  return { type: PATHS_LIST };
}

export function pathsListSuccess(paths) {
  return { type: PATHS_LIST_SUCCESS, paths };
}

export function pathsListFailure(errors) {
  return { type: PATHS_LIST_FAILURE, errors };
}

export function pathsList(userId) {
  return (dispatch) => {
    dispatch(doPathsList());

    return fetch(config.paths_api_url + userId)
      .then(response => response.json())
      .then(paths => dispatch(pathsListSuccess(paths)))
      .catch(errors => dispatch(pathsListFailure(errors)));
  };
}
