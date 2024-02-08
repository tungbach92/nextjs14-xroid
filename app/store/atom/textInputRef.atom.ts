import {atom} from "jotai";
import {MutableRefObject} from "react";

export const textInputRefAtom = atom<MutableRefObject<HTMLInputElement>>({current: undefined})
