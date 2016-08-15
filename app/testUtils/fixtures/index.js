import { times } from 'lodash';
import generateSkill from './skill';

const fixtures = {
  skill: generateSkill,
};

export default function generate(fixture, amount = 1, values) {
  return times(amount, () => fixtures[fixture](values));
}
