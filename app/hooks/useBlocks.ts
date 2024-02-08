import {useCollectionData} from "react-firebase-hooks/firestore";
import {useEffect, useState} from "react";
import {blocksColRef} from "@/app/common/firebase/dbRefs";
import {useAtom, useSetAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {rerenderOutputGroupsImageEnecolor, rerenderOutputGroupsTextEnecolor} from "@/app/utils/blockEnecolor";
import {newBlockData} from "@/app/common/newBlockData";
import {
  UROID_CHARPROMPT_FOOTER, UROID_CHARPROMPT_HEADER,
  UROID_DEFAULTIMAGE, UROID_DEFAULTVOICE,
  UROID_DES,
  UROID_NAME,
  UROID_THUMB
} from "@/app/configs/constants";
import {Block} from "@/app/types/block";
import {useRouter} from "next/navigation";
import {cloneDeep} from "lodash";


function useBlocks(chapterId: string) {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [oldBlocks, setOldBlocks] = useState<Block[]>([])
  // const setOldBlocks = useSetAtom(oldBlocksAtom)
  const _blocksColRef = chapterId && blocksColRef(chapterId);
  const [value, loading, error] = useCollectionData(_blocksColRef);
  const [allBlocks, setAllBlocks] = useState<Block[]>([])
  const router = useRouter()
  const isCreateURoid = router.query?.isCreateURoid


  useEffect(() => {
    if (error || loading || (!loading && !value)) {
      setBlocks(null)
      setOldBlocks(null)
      setAllBlocks(null)
      return
    }

    const _blocks = value.map((document) => {
        return {
          ...document,
          id: document.id,
        } as Block
      }
    ).filter((item: any) => item.isDeleted !== true)

    const _allBlocks = value.map((document) => {
        return {
          ...document,
          id: document.id,
        } as Block
      }
    )

    const reorderEnecolorBlocks = reorderOutpuGroupForTextAndEnecolorBlock(_blocks)

    addControlBlock(reorderEnecolorBlocks)
    addUroidBlock(reorderEnecolorBlocks)
    setOldBlocks(_blocks)
    setBlocks(reorderEnecolorBlocks)
    setAllBlocks(_allBlocks)
  }, [value, error, loading, chapterId])

  const reorderOutpuGroupForTextAndEnecolorBlock = (blocks) => {
    const newBlocks = [];
    blocks?.forEach((item: any) => {
      switch (item.type) {
        case "text":
        case "enecolor_rank_text":
          const rankTextBlock = {
            ...item,
            data: {
              ...item.data,
              groupsText: rerenderOutputGroupsTextEnecolor(item?.data.output_type, item?.data.groupsText)
            }
          };
          newBlocks.push({...rankTextBlock})
          break
        case "enecolor_rank_img":
          const rankImgBlock = {
            ...item,
            data: {
              ...item.data,
              groupsImg: rerenderOutputGroupsImageEnecolor(item?.data.output_type, item?.data.groupsImg)
            }
          }
          newBlocks.push({...rankImgBlock})
          break
        default:
          newBlocks.push({...item})
      }
    });


    return newBlocks
  }


  const addControlBlock = (newBlocks) => {
    if (chapterId === 'createChapter') {
      newBlocks.push(newBlockData("control", []))
    }
  }
  const addUroidBlock = (newBlocks) => {
    if (chapterId === 'createChapter' && isCreateURoid === 'true') {
      newBlocks.push(newBlockData(UROID_NAME, [])),
        newBlocks.push(newBlockData(UROID_DES, [])),
        newBlocks.push(newBlockData(UROID_THUMB, [])),
        newBlocks.push(newBlockData(UROID_DEFAULTIMAGE, [])),
        newBlocks.push(newBlockData(UROID_DEFAULTVOICE, [])),
        newBlocks.push(newBlockData(UROID_CHARPROMPT_HEADER, [])),
        newBlocks.push(newBlockData(UROID_CHARPROMPT_FOOTER, []))
    }
  }

  return {blocks, setBlocks, loading, error, allBlocks, oldBlocks};
}

export default useBlocks;
