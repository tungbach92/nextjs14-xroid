import {useEffect} from "react";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useAtom, useSetAtom} from "jotai";
import {readWriteOldBlocksAtom} from "@/app/store/atom/oldBlocks.atom";
import {BlockText} from "@/app/types/block";
import {setGroupText} from "@/app/common/setGroupText";

interface Props {
  output_type: string
  resultUserInputs: string[]
  id: string
  isShowUserInputLabel: boolean
}

export const useSetGroupsTextValue = ({
  output_type,
  resultUserInputs,
  id,
  isShowUserInputLabel,
}: Props) => {

  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const updateOldBlocks = useSetAtom(readWriteOldBlocksAtom)

  useEffect(() => {
    if (!resultUserInputs || resultUserInputs?.length === 0 || !isShowUserInputLabel) return
    const blockText = blocks.find(block => block.id === id) as BlockText
    setGroupText({
      output_type,
      resultUserInputs,
      block: blockText
    })
    updateBlocks(blockText)
    // updateOldBlocks(blockText)

  }, [resultUserInputs, output_type, isShowUserInputLabel])
}
