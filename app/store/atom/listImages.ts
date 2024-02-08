import {atom} from "jotai";

export interface ImageAtom {
  id?: string;
  createdAt?: number;
  url?: string;
  userId?: string;
  isDeleted?: boolean;
  updatedAt?: number;
}

export const listImagesAtom = atom<ImageAtom[]>([]);
