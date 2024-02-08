import {atom, useAtom} from "jotai";
import {DataStructure, NewDataStructure} from "@/app/types/types";

export const structureDataAtom = atom<DataStructure[]>([])

export const newDataStructureAtom = atom<NewDataStructure[]>([])

export const selectedDataStructureContentAtom = atom<DataStructure[]>([])

export const dataStructIdContentAtom = atom((get) => get(selectedDataStructureContentAtom).map(item => item.id) || [])

export const useStructureDataAtom = () => useAtom(structureDataAtom);
