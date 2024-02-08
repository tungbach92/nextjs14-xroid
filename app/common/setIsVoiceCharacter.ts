import {cloneDeep} from "lodash";
import {CharacterBlock} from "@/app/types/types";
import {AllBlockType, Block} from "@/app/types/block";

interface Props {
    updateBlocks: React.Dispatch<React.SetStateAction<Block>>
    block: AllBlockType
    charId: string
}

export const setIsVoiceCharacter = ({updateBlocks, block, charId}: Props): AllBlockType => {
    const _block = cloneDeep(block)
    let newCharacters: CharacterBlock[] = []
    _block.characters.forEach((c) => {
        newCharacters.push({
            ...c,
            isVoice: c.id === charId ? !c.isVoice : false,
        })
    })
    _block.characters = newCharacters
    updateBlocks(_block)
  return _block
}
