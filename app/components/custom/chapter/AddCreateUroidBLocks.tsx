import React, {MutableRefObject} from 'react';
import {Chapter} from "@/app/types/types";
import Button from "@mui/material/Button";
import {mapDataToAddIndex} from "@/app/common/mapDataToAddIndex";
import {handleAddBlock} from "@/app/components/custom/chapter/contents/common/handleAddBlock";
import {useAtom, useAtomValue} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {useScrollToBottomPage} from "@/app/hooks/useScrollToBottomPage";
import {Block} from "@/app/types/block";
import {cloneDeep} from "lodash";
import {
  IMAGE_TYPE_UROID,
  UROID_CHARPROMPT_FOOTER,
  UROID_CHARPROMPT_HEADER,
  UROID_DEFAULT_IMAGE_CHOICE,
  UROID_DEFAULT_IMAGE_RANDOM,
  UROID_DEFAULTIMAGE,
  UROID_DEFAULTVOICE,
  UROID_DES,
  UROID_NAME,
  UROID_THUMB
} from "@/app/configs/constants";
import {imageUri} from "@/app/components/assets";
import {BaseDeleteModal} from "@/app/components/base";
import TextField from "@mui/material/TextField";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {VirtuosoHandle} from "react-virtuoso";

type props = {
  chapter: Chapter,
  setChapter?: React.Dispatch<React.SetStateAction<Chapter>>
  virtuosoRef?: MutableRefObject<VirtuosoHandle>
  blockIndex?: number
  addNewBlocks?: Block[]
  setAddNewBlocks?: (e: Block[]) => void
  isFullFieldUroid?: boolean
}

const listButton = [
  {
    name: 'Name',
    blockType: UROID_NAME
  },
  {
    name: 'Description',
    blockType: UROID_DES
  },
  {
    name: 'Default Image',
    blockType: UROID_DEFAULTIMAGE
  },
  {
    name: 'Choose Default Image',
    blockType: UROID_DEFAULT_IMAGE_CHOICE
  },
  {
    name: 'Random Choose Default Image',
    blockType: UROID_DEFAULT_IMAGE_RANDOM
  },
  {
    name: 'Thumbnail',
    blockType: UROID_THUMB
  },
  {
    name: 'Default Voice',
    blockType: UROID_DEFAULTVOICE
  },
  {
    name: 'Character Prompt Header',
    blockType: UROID_CHARPROMPT_HEADER
  },
  {
    name: 'Character Prompt Footer',
    blockType: UROID_CHARPROMPT_FOOTER
  }
]

function AddCreateUroidBLocks({
  chapter,
  virtuosoRef,
  blockIndex,
  addNewBlocks,
  setAddNewBlocks,
  isFullFieldUroid,
  setChapter
}: props) {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const {setDummyAdd} = useScrollToBottomPage({virtuosoRef})
  const [openModal, setOpenModal] = React.useState(false)
  const [type, setType] = React.useState('')


  const commonProps = {
    url: '',
    selectedTextSetting: null,
    blockIndex: blockIndex,
    setDummyAdd: setDummyAdd,
    setBlocks: setBlocks,
    actionCharacter: [],
    mapDataToAddIndex: mapDataToAddIndex,
    addNewBlocks: addNewBlocks,
    setAddNewBlocks: setAddNewBlocks,
    blocks,
    virtuosoRef
  }
  const onAddBlock = (type: string) => {
    const Props = {
      ...commonProps,
      type: type,
      blocks: blocks,
    }
    handleAddBlock(Props)
  }
  const removeAndAddNewBlock = () => {
    const imageBlockIndex = blocks?.findIndex(block => IMAGE_TYPE_UROID.includes(block.type))
    const Props = {
      ...commonProps,
      type: type,
      imageBlockIndex
    }
    handleAddBlock(Props)
    setOpenModal(false)
  }

  const goToBlock = (type: string) => {
    const index = blocks?.findIndex(item => item.type === type)
    if (index > 0) {
      virtuosoRef?.current?.scrollToIndex({index: index - 1, align: 'center'})
    }
  }

  const openModalDelete = (type: string) => {
    setOpenModal(true)
    setType(type)
  }
  const onChangeUroidName = (e) => {
    const _chapter = cloneDeep(chapter)
    _chapter.uRoidName = e.target.value
    setChapter(_chapter)
  }

  const listSelectedBlock = listButton?.map(item => item.blockType)
  const blocksType = blocks?.map(item => item?.type)
  const checkList = listSelectedBlock?.filter(item => blocksType?.includes(item))
  const chapterError = useAtomValue(chapterErrorAtom)
  const errCondition = Boolean(chapterError.uRoidName) && !chapter?.uRoidName && chapter?.chapterType === 'createURoid'

  return (
    <div>
      {
        chapter &&
        <div
          className={`flex flex-col border-2 border-solid ${isFullFieldUroid ? 'border-red-500' : 'border-[#70B2FF]'} rounded w-full items-center pb-3`}>
          <img src={chapter?.thumbnail || imageUri.iconImg.noImageIcon} alt={'avatar'}
               className={'mx-3 py-2 w-40 h-40 border object-contain my-2'}/>
          <TextField value={chapter?.uRoidName ?? chapter.title}
                     size={'small'}
                     error={errCondition}
                     placeholder={'Uroid名'}
                     className={'text-center w-[171px] pb-2'}
                     onChange={(e) => onChangeUroidName(e)}
          />
          <div className={'flex flex-col gap-3 mx-2 pt-2'}>
            {
              listButton?.map((item, index) => {
                const condition = checkList?.includes(item?.blockType)
                const checkDisabled = Boolean(blocks?.find(block => IMAGE_TYPE_UROID.includes(block.type))) && IMAGE_TYPE_UROID?.includes(item?.blockType) && !condition

                return (
                  <div key={index} className={'w-full relative'}>
                    <Button variant={'outlined'}
                            size={'large'}
                            sx={{textTransform: 'none'}}
                            className={`text-xs w-full ${checkDisabled ? 'opacity-50' : 'hover:bg-blue-500 hover:text-white'}`}
                            color={condition ? 'primary' : 'inherit'}
                            onClick={() => {
                              `${condition ? goToBlock(item?.blockType) : checkDisabled ? openModalDelete(item?.blockType) : onAddBlock(item.blockType)}`
                            }}
                    >{item.name}</Button>
                    {
                      (index === 1 || index === 4) &&
                      <div className={'h-[1px] bg-gray-300 mt-3'}/>
                    }
                    {
                      condition &&
                      <img src={'/icons/blueCheck.svg'} alt={'check'} className={'absolute -top-3 -right-2'}/>
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      }
      {
        openModal &&
        <BaseDeleteModal isOpen={openModal} handleClose={() => setOpenModal(false)}
                         label={`画像ブロックの設定を変更しますか？`}
                         handleDelete={removeAndAddNewBlock}/>
      }
    </div>
  );
}

export default AddCreateUroidBLocks;
