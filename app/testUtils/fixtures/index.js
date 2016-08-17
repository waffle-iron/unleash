import { times } from 'lodash';
import generateSkill from './skill';
import generateProfile from './profile';

const fixtures = {
  skill: generateSkill,
  profile: generateProfile
};

export default function generate(fixture, amount = 1, values) {
  return times(amount, () => fixtures[fixture](values));
}
