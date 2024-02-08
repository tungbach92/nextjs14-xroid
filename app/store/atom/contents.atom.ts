import {atomWithStorage} from 'jotai/utils';
import {atom, useAtom} from "jotai";
import {Content} from "@/app/types/content"; //

const contentsAtom = atom<Content[]>([]);
const contentAtom = atom<Content>({});

const useContentAtom = () => useAtom(contentAtom);
const contentsAtomWithStorage = atomWithStorage('contents', [])
export {
  contentAtom,
  contentsAtom,
  contentsAtomWithStorage,
  useContentAtom,
};
