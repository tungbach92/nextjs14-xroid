import {atom} from "jotai";
import {Category} from "@/app/types/types";

const categoryAtom = atom<Category[]>([])

export {categoryAtom}
