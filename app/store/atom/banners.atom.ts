import {atom, useAtom} from "jotai";
import {BannerData} from "@/app/types/types";

const bannersAtom = atom<BannerData[]>([])
export const useBanner = () => useAtom(bannersAtom);
