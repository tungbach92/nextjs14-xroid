import {atom} from "jotai";
import {Chapter} from "@/app/types/types";

const chapterByIdAtom = atom({} as Chapter);

export {
  chapterByIdAtom
}
