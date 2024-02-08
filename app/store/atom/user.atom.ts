import {atomWithStorage} from 'jotai/utils';
import {atom} from "jotai"; //

const userAtom = atom({});
const userAtomWithStorage = atomWithStorage<any>('userInfo', {})
export {
  userAtom,
  userAtomWithStorage,
};
