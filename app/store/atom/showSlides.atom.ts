import {atom} from "jotai";

type showSlide = {
  showSlideId: string,
  imgThumbs: string[]
} []

export const showSlide = atom<showSlide>([])
