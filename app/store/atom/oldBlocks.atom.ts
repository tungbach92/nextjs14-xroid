import {atom} from "jotai";
import {Block} from "@/app/types/block";
import {cloneDeep} from "lodash";

export const oldBlocksAtom = atom<Block[]>([])

export const readWriteOldBlocksAtom = atom(
  (get) => get(oldBlocksAtom),
  (get, set, block: Block) => {
    const idx = get(oldBlocksAtom).findIndex((b) => b.id === block.id);
    if (idx === -1) return
    const _blocks = cloneDeep(get(oldBlocksAtom))
    _blocks[idx] = {...block}
    set(oldBlocksAtom, _blocks)
    // you can set as many atoms as you want at the same time
  }
)
