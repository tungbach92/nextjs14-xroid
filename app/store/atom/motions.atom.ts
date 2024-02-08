import {atom} from "jotai";
import {Pose} from "@/app/types/types";

export const posesAtom = atom<Pose[]>([])
