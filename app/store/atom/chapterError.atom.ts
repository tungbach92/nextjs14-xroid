import {atom} from "jotai";

export interface ChapterError {
  [p: string]: string;
}

export const chapterErrorAtom = atom<ChapterError>({})
export const updateChapterErrorAtom = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, val: ChapterError) => {
    // `update` is any single value we receive for updating this atom
    const chapterError = {...get(chapterErrorAtom), ...val}
    set(chapterErrorAtom, chapterError)
  }
)
export const clearChapterErrorAtom = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, key: string) => {
    // `update` is any single value we receive for updating this atom
    const chapterError = {...get(chapterErrorAtom)}
    delete chapterError[key]
    set(chapterErrorAtom, chapterError)
  }
)
