import { PROFILE_LIST_SUCCESS, PROFILE_LIST_FAILURE } from '../actions/ProfileActions';

function profilesReducer(profiles = {}, action) {
  Object.freeze(profiles);

  let newProfiles;
  switch (action.type) {
    case PROFILE_LIST_SUCCESS:
      newProfiles = {};
      if (action.profiles.Count) {
        action.profiles.Items.forEach((profile) => {
          newProfiles[profile.username] = profile;
        });
      }
      return newProfiles;
    case PROFILE_LIST_FAILURE:
      return {};
    default:
      return profiles;
  }
}

export default profilesReducer;
