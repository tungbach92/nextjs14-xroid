import React, {useMemo} from 'react';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ButtonAddImage from "@/app/components/ButtonCustom/ButtonAddImage";
import {TextField} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {Chapter, CharacterBlock} from "@/app/types/types";
import {useRouter} from "next/navigation";
import Button from "@mui/material/Button";
import {Content} from "@/app/types/content";
import {useAtom, useSetAtom,useAtomValue} from "jotai";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {cloneDeep} from "lodash";
import {Block} from "@/app/types/block";
import {
  DEFAULT_POS,
  FULL_FIELD_UROID, IMAGE_TYPE_UROID
} from "@/app/configs/constants";
import {mapDataToAddIndex} from "@/app/common/mapDataToAddIndex";
import {handleAddBlock} from "@/app/components/custom/chapter/contents/common/handleAddBlock";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {toast} from "react-toastify";

type props = {
  chapterId: string
  chapter: Chapter
  setChapter: React.Dispatch<React.SetStateAction<any>>
  isDirtyChapter: boolean
  setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  setIsSwitch: React.Dispatch<React.SetStateAction<string>>
  loadingImg: boolean
  setLoadingImg: React.Dispatch<React.SetStateAction<boolean>>
  chapters: Chapter[]
  switchChapter?: (type: string) => void
  checkThumb?: boolean
  contentData?: Content
  blockIndex?: number,
  virtuosoRef?: any,
  addNewBlocks?: Block[]
  setAddNewBlocks?: (e: Block[]) => void
  oldChapter?: Chapter
}

const chapterType = [
  {
    value: 'standard',
    name: 'スタンダード',
  },
  {
    value: 'tool',
    name: 'ツール',
  },
  {
    value: 'roid',
    name: 'ロイド',
  },
  {
    value: 'createURoid',
    name: 'ロイド作成',
  }
]

function ChapterTitleComp({
                            checkThumb,
                            chapterId,
                            chapter,
                            setChapter,
                            isDirtyChapter,
                            setIsShowDialog,
                            setIsSwitch,
                            loadingImg,
                            setLoadingImg,
                            chapters,
                            switchChapter,
                            contentData,
                            blockIndex,
                            virtuosoRef,
                            addNewBlocks,
                            setAddNewBlocks,
                            oldChapter
                          }: props) {

  const listOnlyChapter = chapters?.length ? chapters.filter(i => !i.isBanner) : []
  const router = useRouter()
  const contentId = router?.query?.contentId
  const [chapterError] = useAtom(chapterErrorAtom)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const isCreateURoid = router.query?.isCreateURoid


  const onAddBlock = (type: string, url = '', selectedTextSetting = null) => {
    const Props = {
      type: type,
      url: url,
      selectedTextSetting: selectedTextSetting,
      blocks: blocks,
      blockIndex: blockIndex,
      setDummyAdd: () => {},
      setBlocks: setBlocks,
      actionCharacter: [],
      mapDataToAddIndex: mapDataToAddIndex(blocks),
      addNewBlocks: addNewBlocks,
      setAddNewBlocks: setAddNewBlocks,
    }
    handleAddBlock(Props)
  }
  const handleChangeChapterType = (value: string) => {
    if (value === 'createURoid' || chapter?.chapterType === 'createURoid') {
      if(chapter?.mentoroids?.find(m => m?.includes('uRoidTemp_'))) {
        toast.error('Uroidはロイド作成のチャプターでは使用できません。')
        return
      }
      onAddBlock('createURoid')
    }
    if (value === 'createURoid' && blocks?.find(block => FULL_FIELD_UROID.concat(IMAGE_TYPE_UROID).includes(block.type))) {
      onAddBlock('')
    }
    setChapter({chapterType: value})
  }
  const checkValidNextOrPrev = (type: string) => {
    const indexOnActiveChapter = listOnlyChapter?.findIndex(item => item.id === chapterId)
    if (type === 'prev' && indexOnActiveChapter > 0) {
      return true
    } else if (type === 'next' && indexOnActiveChapter < listOnlyChapter?.length - 1) {
      return true
    }
    return false
  }

  const indexOnActiveChapter = useMemo(() => {
    if (listOnlyChapter?.length == 0) return null
    const item = listOnlyChapter?.find((i: any) => i?.id === chapterId)
    if (item) {
      return item?.chapterIndex
    }
    return null
  }, [listOnlyChapter, chapterId])

  return (
    <div>
      <div className={'flex flex-col justify-center'}>
        <div className='flex gap-3 items-center pb-[30px]'>
          <div className={'h-[85px] w-[75px] overflow-hidden rounded-md flex items-center justify-center'}
               onClick={() => {
                 if (isDirtyChapter)
                   setIsShowDialog(true)
                 else
                   router.push(`/contents/${contentId}`)
               }}>
            <img src={contentData?.thumbnail || '/icons/no-image-frees.png'} alt={''}
                 className={'rounded-xl h-24 w-auto cursor-pointer'}/>
          </div>
          <div className={"line-clamp-1 max-w-[200px] truncate"}>
            {contentData?.title}
          </div>
        </div>


        <div className={'flex items-center pb-3 -ml-[8px]'}>
          {chapterId !== "createChapter" &&
            <ArrowBackIosNewIcon
              onClick={() => {
                if (isDirtyChapter) {
                  setIsShowDialog(true)
                  setIsSwitch('prev')
                } else
                  switchChapter('prev')
              }}
              className={`text-gray-500 ${indexOnActiveChapter > 0 ? 'hover:cursor-pointer text-blue-500' : ''}`}/>}
          <div className={'flex items-center'}>
            <ButtonAddImage
              loading={loadingImg}
              setLoading={setLoadingImg}
              previewUrl={chapter?.thumbnail}
              setChapter={setChapter}
              sizeDefault={'w-7 h-7'}
              size={'w-[40px] h-[40px] rounded'}
              className={`bg-[#DAE7F6] text-gray-500 -mr-2 z-20 ${checkValidNextOrPrev('prev') ? 'hover:cursor-pointer text-blue-500' : ''}
              ${checkThumb && 'border-red-500 border-2 border-solid'}`}
            />
            {/*<div className={'pt-[1px] pb-[5px] whitespace-nowrap ml-3'}>*/}
            {/*  {chapterId !== "createChapter" ? indexOnActiveChapter + 1 + ' -' : ""}*/}
            {/*</div>*/}
            <TextField
              value={chapter?.title}
              placeholder={'チャプタータイトル'}
              onChange={(e) => {
                const title = e.target.value
                setChapter({title})
                if (title.trim().length > 0) {
                  clearChapterError('title')
                }
              }}
              size={'small'}
              error={Boolean(chapterError?.title)}
              className={'bg-white shadow-md z-10 w-[160px]'}
              sx={{"& .MuiOutlinedInput-notchedOutline": {border: Boolean(chapterError?.title) ? "solid" : 'none'}}}
            />
          </div>
          {chapterId !== "createChapter" &&
            <ArrowForwardIosIcon
              onClick={() => {
                if (isDirtyChapter) {
                  setIsShowDialog(true)
                  setIsSwitch('next')
                } else
                  switchChapter('next')
              }}
              className={`text-gray-500 ${checkValidNextOrPrev('next') ? 'hover:cursor-pointer text-blue-500' : ''}`}/>
          }

        </div>
        <div className="gap-1 flex flex-wrap max-w-[200px]">
          {chapterType.map((c) => {
            const booleanType = chapter?.chapterType === 'createURoid' && oldChapter?.chapterType === 'createURoid'
            const booleanChapterId = router?.query?.createChapter === 'createChapter'
            const condition = booleanType && !booleanChapterId || isCreateURoid === 'true'
            return (
              <Button
                disabled={condition}
                size={'small'}
                variant="text"
                className={"text-black"}
                sx={{borderRadius: '5px', border: '1px solid #9B9B9B'}}
                style={{
                  backgroundColor: chapter?.chapterType === c.value ? '#F5BA15' : condition ? 'white' : 'white',
                  opacity: chapter?.chapterType === c.value ? 1 : condition ? 0.5 : 1
                }}
                onClick={() => handleChangeChapterType(c.value)}
                key={c.value}
              >
                <div className={'mx-2 my-1 text-xs'}>
                  {c.name}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChapterTitleComp;
