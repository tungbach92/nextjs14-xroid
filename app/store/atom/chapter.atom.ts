import {atom} from "jotai";
import {Chapter} from "@/app/types/types";

const chapterAtom = atom<Array<Chapter>>([]);

export {
  chapterAtom
}
