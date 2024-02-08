import {atom} from "jotai";
import {Character} from "@/app/types/types";

const charactersAtom = atom<Character[]>([]);

export {
  charactersAtom,
};
