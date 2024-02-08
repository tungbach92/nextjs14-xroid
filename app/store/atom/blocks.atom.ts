import {atom} from "jotai";
import {Block} from "@/app/types/block";
import {cloneDeep} from "lodash";

export const blocksAtom = atom<Block[]>([])

export const readWriteBlocksAtom = atom(
    (get) => get(blocksAtom),
    (get, set, block: Block) => {
        const idx = get(blocksAtom).findIndex((b) => b.id === block.id);
        if (idx === -1) return
        const _blocks = cloneDeep(get(blocksAtom))
        _blocks[idx] = {...block}
        set(blocksAtom, _blocks)
        // you can set as many atoms as you want at the same time
    }
)
