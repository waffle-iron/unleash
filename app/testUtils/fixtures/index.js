import { times } from 'lodash';
import generateSkill from './skill';
import generateProfile from './profile';
import generatePath from './path';

const fixtures = {
  skill: generateSkill,
  profile: generateProfile,
  path: generatePath,
};

export default function generate(fixture, amount = 1, values) {
  return times(amount, () => fixtures[fixture](values));
}
