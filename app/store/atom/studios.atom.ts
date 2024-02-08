import {atom} from "jotai";
import {Studio} from "@/app/types/types";

const studioAtom = atom<Studio>({});

export {
  studioAtom,
};
