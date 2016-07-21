import {SKILL_LIST_SUCCESS, SKILL_LIST_FAILURE} from '../actions/SkillActions';

function skillsReducer(skills = {}, action) {
  Object.freeze(skills);

  let newSkills;
  switch (action.type) {
    case SKILL_LIST_SUCCESS:
      newSkills = {};
      action.skills.forEach((skill) => {
        newSkills[skill.name] = skill;
      });
      return newSkills;
    case SKILL_LIST_FAILURE:
      return {};
    default:
      return skills;
  }
}

export default skillsReducer;
