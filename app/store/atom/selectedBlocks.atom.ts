import {atom} from "jotai";
import {Block} from "@/app/types/block";

export const selectedBlocksAtom = atom<Block[]>([])
