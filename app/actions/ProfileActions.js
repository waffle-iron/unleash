import config from '../../config';

export const PROFILE_LIST = 'PROFILE_LIST';
export const PROFILE_LIST_SUCCESS = 'PROFILE_LIST_SUCCESS';
export const PROFILE_LIST_FAILURE = 'PROFILE_LIST_FAILURE';

function doProfileList() {
  return { type: PROFILE_LIST };
}

export function profileListSuccess(profiles) {
  return { type: PROFILE_LIST_SUCCESS, profiles };
}

export function profileListFailure(errors) {
  return { type: PROFILE_LIST_FAILURE, errors };
}

export function profileList() {
  return (dispatch) => {
    dispatch(doProfileList());

    return fetch(config.profiles_api_url)
      .then(response => response.json())
      .then(profiles => dispatch(profileListSuccess(profiles)))
      .catch(errors => dispatch(profileListFailure(errors)));
  };
}
