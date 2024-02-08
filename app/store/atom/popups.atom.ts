import {atom, useAtom} from "jotai";
import {PopupData} from "@/app/types/types";

const popupsAtom = atom<PopupData[]>([])
export const usePopup = () => useAtom(popupsAtom);
