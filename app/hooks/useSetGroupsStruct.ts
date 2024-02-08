import {Dispatch, SetStateAction, useEffect} from "react";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {readWriteOldBlocksAtom} from "@/app/store/atom/oldBlocks.atom";
import {setGroupStruct} from "@/app/common/setGroupStruct";
import {BlockText} from "@/app/types/block";

interface Props {
  output_type: string
  resultUserInputs: string[]
  id: string
  setIsShowUserInputLabel: Dispatch<SetStateAction<boolean>>
}

export const useSetGroupsStruct = ({output_type, resultUserInputs, id, setIsShowUserInputLabel}: Props) => {
  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const updateOldBlocks = useSetAtom(readWriteOldBlocksAtom)

  useEffect(() => {
    if (!resultUserInputs || resultUserInputs?.length === 0) return
    if (output_type !== 'text') {
      return setIsShowUserInputLabel(true)
    }

    const blockText = blocks.find(block => block.id === id) as BlockText
    setGroupStruct({
      resultUserInputs,
      block: blockText
    })
    updateBlocks(blockText)
    // updateOldBlocks(blockText)
  }, [output_type, resultUserInputs])
}
