import {atom} from "jotai";
import {Character} from "@/app/types/types";

export const selectedCharacterInContentAtom = atom<Character[]>([])
