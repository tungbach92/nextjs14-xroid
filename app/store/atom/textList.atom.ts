import {atom, useAtom} from "jotai";
import {TextList} from "@/app/types/types";

const textListAtom = atom<TextList[]>([])
export const useTextListAtom = () => useAtom(textListAtom);
