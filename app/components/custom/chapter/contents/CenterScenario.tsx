import React, {MutableRefObject, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DraggableRubric,
  type DraggableStateSnapshot,
  Droppable,
  type DroppableProvided
} from "react-beautiful-dnd";
import {cloneDeep, isEqual, orderBy, uniqWith} from "lodash";
import {getId} from "@/app/common/getId";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import useStructureData from "@/app/hooks/useStructureData";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {Chapter} from "@/app/types/types";
import {selectedBlocksAtom} from "@/app/store/atom/selectedBlocks.atom";
import Modal from "@/app/components/custom/Modal";
import RightScenario from "@/app/components/custom/chapter/contents/RightScenario";
import {useRouter, useSearchParams} from "next/navigation";
import {mapDataToAddIndex} from "@/app/common/mapDataToAddIndex";
import {selectedBlocksAddAtIndexAtom} from "@/app/store/atom/selectedBlocksAddAtIndex.atom";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {oldBlocksAtom} from "@/app/store/atom/oldBlocks.atom";
import {Virtuoso} from 'react-virtuoso'
import {CircularProgress} from "@mui/material";
import DraggableBlock from "@/app/components/custom/chapter/contents/component/DraggableBlock";
import {Block, BlockURoidThumbnail} from "@/app/types/block";
import {getCharInBlock} from "@/app/common/getCharInBlock";
import {onDeleteCouple} from "@/app/common/onDeleteStartEnd";
import {checkTimerTriggerPosition} from "@/app/common/checkTimerTriggerPosition";
import {checkPositionSlide} from "@/app/common/checkPositionSlide";
import {checkPositionMovingOneSlide} from "@/app/common/checkPositionMovingOneSlide";
import ActionModalChild from "@/app/components/custom/ActionModalChild";
import {toast} from "react-toastify";
import {
  PROMPT_ALL_TYPES,
  PROMPT_ANSWER_TYPES,
  PROMPT_TYPES,
  UROID_DEFAULTIMAGE,
  UROID_THUMB
} from "@/app/configs/constants";
import {disableChatGPTVersion} from "@/app/common/checkDisableGPTVersion";
import {isFocusNewBlocks} from "@/app/store/atom/isFocusNewBlocks";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";
import {addCoupleSlideToBlockSelection} from "@/app/common/addCoupleSlideToBlockSelection";


// eslint-disable-next-line react/display-name
const HeightPreservingWrapper = React.memo(({children, ...props}: any) => {
  return (
    // the height is necessary to prevent the item container from collapsing, which confuses Virtuoso measurements
    // @ts-ignore
    <div {...props} style={{'--data-known-size': `${props['data-known-size']}px`}}>
      {children}
    </div>
  )
})

type props = {
  chapter?: Chapter
  loading?: boolean
  blocks?: Block[]
  setBlocks?: React.Dispatch<SetStateAction<Block[]>>
  virtuosoRef?: MutableRefObject<any>
  isHistory?: boolean
};

function CenterScenario({chapter, loading, blocks, setBlocks, virtuosoRef, isHistory = false}: props) {
  useStructureData()
  const router = useRouter()
  const {contentId, createChapter: chapterId}: any = useSearchParams()
  // const [actionCharacter,] = useAtom(actionCharacterAtom)
  const [userInfo] = useAtom(userAtomWithStorage);
  const [ids] = useAtom(structureIdInnChapterAtom)
  // const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [isTimelineImageSetting, setIsTimelineImageSetting] = useState<boolean>(false)
  const [isTimelineAudioSetting, setIsTimelineAudioSetting] = useState<boolean>(false)
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('')
  const [audioName, setAudioName] = useState<string>('')
  const [isHoverAudio, setIsHoverAudio] = useState<boolean>(false)
  const [isHoverImage, setIsHoverImage] = useState<boolean>(false)
  const [loadingImg, setLoadingImg] = useState<boolean>(false)
  const [arraySameImage, setArraySameImage] = useState<number[]>([])
  const [arraySameMusic, setArraySameMusic] = useState<number[]>([])
  // const [selectedItems, setSelectedItems] = React.useState([]);
  const [draggedItemId, setDraggedItemId] = React.useState(null);
  const [hoveredItemIdx, setHoveredItemIdx] = React.useState(null);
  const [blocksSelection, setBlocksSelection] = useAtom(selectedBlocksAtom)
  const [selectedEneColorRankImgSetting, setSelectedEneColorRankImgSetting] = useState<any>({})
  const [selectedEneColorRankTextSetting, setSelectedEneColorRankTextSetting] = useState<any>({})
  const [selectedBlocksInChapterId, setSelectedBlocksInChapterId] = useState<string>("")
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [, setIsFocusBlocks] = useAtom(isFocusNewBlocks)
  const [blockIndex, setBlockIndex] = useState<number>(null)
  const [addNewBlocks, setAddNewBlocks] = useAtom(selectedBlocksAddAtIndexAtom)
  const selectedCharsInContent = useAtomValue(selectedCharacterInContentAtom)
  // const {blocks, setBlocks} = useBlocks(chapterId)
  const setOldBlocks = useSetAtom(oldBlocksAtom)
  const [audio, setAudio] = useState(new Audio())
  const [disableSound,] = useAtom(disableSoundAtom)
  const length = blocks?.length || 0
  const [activePlayer, setActivePlayer] = useState<any>(null);

  useEffect(() => {
    if (addNewBlocks?.length) {
      setIsFocusBlocks(true)
      return;
    }

  }, [addNewBlocks?.length])

  useEffect(() => {
    if (selectedBlocksInChapterId !== chapter?.id) {
      const newBlocksSelection: Block[] = [];
      blocksSelection.length && blocksSelection?.forEach((item, index) => {
        newBlocksSelection.push({
          ...item,
          index: index,
          characters: getCharInBlock(selectedCharsInContent),
        })
      })
      setBlocksSelection(newBlocksSelection)
    }
  }, [chapter?.id, selectedCharsInContent])

  const onDelete = useCallback((index: number) => {
    let arr = cloneDeep(blocks);
    let block = arr[index]
    if (block?.type === UROID_DEFAULTIMAGE) {
      const uroidThumb = arr.find((item => item.type === UROID_THUMB)) as BlockURoidThumbnail
      if (uroidThumb) uroidThumb.data.thumbUrl = ''
    }
    arr.splice(index, 1);
    const _arr = arr?.filter((item, index) => {
      if (!item?.showSlideId || item?.showSlideId !== block?.showSlideId) {
        return {...item, index: index};
      }
    })
    _arr.forEach((item, index) => item.index = index)
    setBlocks(_arr);
  }, [blocks])

  const onDeleteStartEnd = useCallback((index: any, type: string) => {
    onDeleteCouple(index, type, blocks, setBlocks)
  }, [blocks]);

  const nearestBlock = (type: string, currentIndex: number, array: Block[]) => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (array[i].type === type) {
        return array[i];
      }
    }
    return null;
  };

  const nearestPromptBlock = (types: string[], currentIndex: number, array: Block[]) => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (types.includes(array[i].type)) {
        return array[i];
      }
    }
    return null;
  }
  const nearestChatGPTChatGPTAnswerBlock = (type: string, currentIndex: number, array: Block[]) => {
    if (PROMPT_ALL_TYPES.includes(type)) {
      for (let i = currentIndex + 1; i < array.length; i++) {
        if (PROMPT_ANSWER_TYPES.includes(array[i].type)) {
          return array[i];
        }
      }
    }
    return null;
  };


  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const _blocks: Block[] = blocks?.map((item, index) => {
      return {...item, index: index};
    })
    let items = cloneDeep(_blocks);
    let desIndex = result.destination.index;
    const type = items[result.destination.index].type;
    if (result.destination.index == 0 && type == 'control') return;
    const sourceType = items[result.source.index]?.type;
    const nearestPrompt = nearestPromptBlock(PROMPT_TYPES, result.source.index, items)
    const nearestChatGPTAnswerBlock = nearestChatGPTChatGPTAnswerBlock(items[result.source.index].type, result.source.index, items)
    if (PROMPT_ANSWER_TYPES.includes(sourceType)) {
      if (desIndex <= nearestPrompt?.index) {
        toast.error('GPTの回答ブロックをプロンプトブロックの下に設定してください。')
        return;
      }
    }

    if (desIndex >= nearestChatGPTAnswerBlock?.index ||
      desIndex >= nearestChatGPTAnswerBlock?.index && desIndex <= nearestPrompt?.index) {
      toast.error('GPTの回答ブロックをプロンプトブロックの下に設定してください。pppp')
      return;
    }


    if (!blocksSelection.length) {
      // moving one
      checkPositionMovingOneSlide(_blocks, result, items)
    } else {
      //moving many
      if (blocksSelection?.length) {
        checkPositionSlide(blocksSelection, _blocks, result, items)
      } else {
        items = items?.filter(i => !blocksSelection?.find(e => e.id === i.id))
        items.splice(result.destination.index, 0, ...orderBy(blocksSelection, ['index'], ['asc']));
      }
      setBlocksSelection([]);
    }
    const _items = items?.map((item, index) => {
      if (item?.type === 'control') return item
      const nearestControlBlock = nearestBlock('control', index, items);
      if (nearestControlBlock) item.characters = nearestControlBlock?.characters.map((c) => {
        const char = item?.characters?.find((ch) => ch.id === c.id);
        if (char) return {...char, isAction: c.isAction, position: c.position};
        return c;
      })
      return {
        ...item,
        index: index
      }
    })
    return setBlocks(_items);
  };
  const onCopy = useCallback((index: number) => {
    let block = cloneDeep(blocks[index]);
    let prompt = {} as Block
    let promptAnswer = {} as Block
    for (let i = index; i < blocks.length; i++) {
      if (PROMPT_ANSWER_TYPES.includes(blocks[i].type)) {
        promptAnswer = blocks[i]
        break;
      }
    }
    for (let i = index; i >= 0; i--) {
      if (PROMPT_TYPES.includes(blocks[i].type)) {
        prompt = blocks[i]
        break;
      }
    }
    const selectedIndex = () => {
      if (PROMPT_ANSWER_TYPES.includes(block.type)) return index + 1
      if (PROMPT_TYPES.includes(block.type)) return blocks?.findIndex((item) => item.id === promptAnswer?.id) + 1
    }
    if (PROMPT_ALL_TYPES.includes(block?.type)) {
      if (selectedIndex()) {
        blocks.splice(selectedIndex(), 0, {...prompt, id: getId("block_", 10)},
          {...promptAnswer, id: getId("block_", 10)});
      }
    } else {
      blocks.splice(index, 0, {...block, id: getId("block_", 10)});
    }
    const _block = blocks?.map((item, index) => {
      return {...item, index: index};
    })
    setBlocks(_block);
  }, [blocks]);
  const uploadImage = async (event) => {
    try {
      setLoadingImg(true)
      if (!event || !event.target.files || !event.target.files[0]) return;
      const file = event.target.files[0];
      const url = await handleUploadFile(file, userInfo.user_id);
      setImageUrl(url)
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingImg(false)
    }
  };

  // const handleSubmitImageSetting = () => {
  //     const _blocks = cloneDeep(blocks)
  //     if (end === "") _blocks[start].imageUrl = imageUrl
  //     if (start === "") _blocks[end].imageUrl = imageUrl
  //     if (start !== "" && end !== "") {
  //         for (let index = toNumber(start); index <= toNumber(end); index++) {
  //             _blocks[index].imageUrl = imageUrl
  //         }
  //     }
  //     setBlocks(_blocks)
  //     setIsTimelineImageSetting(false)
  // }

  // const handleOpenAudioSetting = (type: string) => {
  //     setAudioUrl('')
  //     setImageUrl('')
  //     setPreviewAudioUrl('')
  //     setStart("")
  //     setEnd("")
  //     if (type === "music") {
  //         setIsTimelineAudioSetting(true)
  //     } else {
  //         setIsTimelineImageSetting(true)
  //     }
  // }

  // useEffect(() => {
  //   let _arraySameImage = []
  //   for (let i = 0; i < blocks.length - 1; i++) {
  //     if (blocks[i].imageUrl && blocks[i + 1]?.imageUrl && blocks[i].imageUrl === blocks[i + 1].imageUrl) {
  //       _arraySameImage = [..._arraySameImage, i, i + 1];
  //     }
  //   }
  //   // const unique = Array.from(new Set(_arraySameImage))
  //   setArraySameImage(_arraySameImage)

  //   let _arraySameMusic = []
  //   for (let i = 0; i < blocks.length - 1; i++) {
  //     if (blocks[i].audioUrl && blocks[i + 1]?.audioUrl && blocks[i].audioUrl === blocks[i + 1].audioUrl) {
  //       _arraySameMusic = [..._arraySameMusic, i, i + 1];
  //     }
  //   }
  //   // const unique = Array.from(new Set(_arraySameMusic))
  //   setArraySameMusic(_arraySameMusic)
  // }, [blocks])
  const handleItemSelection = useCallback((itemId, event) => {
    const {shiftKey, ctrlKey, metaKey} = event;
    const isMultipleSelectionKeyPressed = shiftKey || ctrlKey || metaKey;
    if (isMultipleSelectionKeyPressed) event.preventDefault();
    if (!isMultipleSelectionKeyPressed) {
      setBlocksSelection([])
      return
    }
    let cloneBlock = blocks?.map((e, idx) => {
      return {...e, index: idx}
    })
    if (shiftKey) {
      const startIndex = blocks?.findIndex((item) => item.id === blocksSelection[0]?.id);
      const endIndex = blocks?.findIndex((item) => item.id === itemId);
      const selectedItems = blocks?.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex));
      setBlocksSelection(selectedItems);
      selectedItems.forEach(selectedItem => {
        addCoupleSlideToBlockSelection(selectedItem, cloneBlock, setBlocksSelection)
      })
      setBlocksSelection(prev => orderBy(prev, ['index'], ['asc']))
    }

    if (isMultipleSelectionKeyPressed) {
      const selectedItem = cloneBlock?.find((item) => item.id === itemId);
      const selectedItemsSet = new Set(blocksSelection?.map((item) => item.id));

      if (selectedItemsSet.has(itemId)) {
        // Deselect the item
        const newSelection = blocksSelection?.filter((item) => item.id !== itemId);
        setBlocksSelection(newSelection);
      } else {
        // Select the item
        addCoupleSlideToBlockSelection(selectedItem, cloneBlock, setBlocksSelection)
        setBlocksSelection(prev => orderBy(uniqWith([...prev, selectedItem], isEqual), ['index'], ['asc']));
      }
    } else {
      const selectedItem = cloneBlock?.find((item) => item.id === itemId);
      setBlocksSelection([selectedItem]);
    }
    setSelectedBlocksInChapterId(chapter?.id)
  }, [blocks, blocksSelection, chapter?.id]);


  // const handleChangeOutPutText = useCallback((e) => {
  //   const id = e.target.dataset.tempid;
  //   setBlocks(blocks => {
  //       const _blocks = cloneDeep(blocks)
  //       const idx = _blocks.findIndex((b) => b.id === id);
  //       if (idx === -1) return;
  //       _blocks[idx].data.message.japanese = e.target.value
  //       _blocks[idx].data.message.english = e.target.value
  //       return _blocks
  //     }
  //   )
  // }, [blocks])

  // const handleGroupTextChange = useCallback((e, grtIndex, grIndex) => {
  //   const id = e.target.dataset.tempid;
  //   setBlocks(blocks => {
  //       const idx = blocks.findIndex((b) => b.id === id);
  //       const _blocks = cloneDeep(blocks)
  //       if (idx === -1) return;
  //       _blocks[idx].data.groupsText[grtIndex].groups[grIndex] = e.target.value
  //       return _blocks
  //     }
  //   );
  // }, [blocks]);


  const handleGetIndex = useCallback((index) => {
    setHoveredItemIdx(index)
  }, [])

  const handlePaste = (type) => {
    const _block = blocks.map((item, index) => {
      return {...item, index: index};
    })
    const selectedBlocks = _block?.filter((item) => blocksSelection?.find((selectedItem) => selectedItem.id === item.id));
    const _selectedBlocks = selectedBlocks?.map((item) => {
      let cloneData = {...item, id: getId("block_", 10)}
      if (item?.type === 'slide' || item?.type === 'show_slide') cloneData = {
        showSlideId: item?.showSlideId || '',
        ...item,
        id: getId("block_", 10),
      }
      return cloneData
    })

    if (hoveredItemIdx === undefined) return;
    let addedBlocks = chapter?.id === selectedBlocksInChapterId ? _selectedBlocks : blocksSelection

    if (hoveredItemIdx === blocks.length - 1 && type === "bottom") {
      setBlocks([..._block, ...cloneDeep(addedBlocks)]?.map((item, index) => {
        return {...item, index: index};
      }))
    } else if (hoveredItemIdx === 0 && type === "top") {
      setBlocks([...cloneDeep(addedBlocks), ..._block]?.map((item, index) => {
        return {...item, index: index};
      }))
    } else if (hoveredItemIdx === 0 && blocks[0]?.type === 'control' && type === "top") {
      return;
    } else {
      let newDataBlocks: Block[] = [..._block]
      newDataBlocks.splice(hoveredItemIdx + 1, 0, ...cloneDeep(addedBlocks))
      setBlocks(newDataBlocks?.map((item, index) => {
        return {...item, index: index};
      }))
    }
  }
  const handleAddNewBlock = useCallback((type, index) => {
    setBlockIndex(index)
    setIsShowModal(true)
  }, [])

  const onAddBlocks = useCallback(() => {
    const _blocks = cloneDeep(blocks)
    _blocks.splice(blockIndex + 1, 0, ...addNewBlocks)
    setBlocks(mapDataToAddIndex(_blocks))
    setIsShowModal(false)
    setBlockIndex(null)

    setTimeout(() => {
      setAddNewBlocks([])
      setIsFocusBlocks(false)
    }, 3000)

  }, [blocks, blockIndex, addNewBlocks])

  const isMultiSelect = blocksSelection?.length > 0

  const handleMultiCopy = useCallback((index: number, type: string) => {
    if (isMultiSelect)
      return handlePaste(type)
    handleAddNewBlock(type, index)
  }, [handlePaste, handleAddNewBlock, isMultiSelect])

  const isTimeTriggerBetweenStartAndEnd = useMemo(() => {
    return checkTimerTriggerPosition(blocks, blockIndex)
  }, [blocks, blockIndex]);


  const handleDeleteSelectedBlock = useCallback((index: number) => {
    const _addNewBlocks = cloneDeep(addNewBlocks)
    if (PROMPT_ANSWER_TYPES.includes(_addNewBlocks[index]?.type)) {
      _addNewBlocks.splice(index - 1, 2)
    } else if (PROMPT_TYPES.includes(_addNewBlocks[index]?.type)) {
      _addNewBlocks.splice(index, 2)
    } else {
      _addNewBlocks.splice(index, 1)
    }
    setAddNewBlocks(_addNewBlocks)
  }, [addNewBlocks, blockIndex])

  const handlePlay = (player: any) => {
    if (activePlayer && activePlayer !== player) {
      if (typeof activePlayer.getInternalPlayer()?.pauseVideo === 'function') {
        activePlayer.getInternalPlayer().pauseVideo();
      }
      if (typeof activePlayer.getInternalPlayer()?.pause === 'function') {
        activePlayer.getInternalPlayer().pause();
      }
    }
    setActivePlayer(player);
  };

  return (
    <div className={`flex ${!isHistory ? 'min-h-screen' : ''} w-full`}>
      <div className={"min-w-max px-2 bg-white rounded-md w-full"}>
        <div className={"flex gap-2 pt-1"}>
          {/*<div className={"flex justify-center items-center"}>*/}
          {/*  <MusicNoteIcon sx={{color: "#9B9B9B", width: 76}} fontSize={"large"}/>*/}
          {/*</div>*/}
          {/*<div className={"flex justify-center items-center"}>*/}
          {/*  <PhotoIcon sx={{color: "#9B9B9B", width: 76}} fontSize={"large"}/>*/}
          {/*</div>*/}
          <div className={"flex-1 text-center m-auto font-bold"}>シナリオ内容(Sum: {blocks?.length})</div>
        </div>
        <hr/>
        <div className={"pb-3 pt-4 max-h-full overflow-x-auto"}>
          {(loading || (!loading && !blocks)) && <CircularProgress className={'flex mx-auto mt-5'}/>}
          {!loading && blocks?.length > 0 &&
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="items" mode="virtual" renderClone={(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
                rubric: DraggableRubric,
              ) => (
                <DraggableBlock provided={provided} isDragging={snapshot.isDragging}
                                block={blocks[rubric.source.index]}
                                index={rubric.source.index} blocksSelection={blocksSelection}
                                handleItemSelection={handleItemSelection}
                                chapter={chapter}
                                ids={ids} onDeleteStartEnd={onDeleteStartEnd}
                                handleGetIndex={handleGetIndex}
                                handleMultiCopy={(type) => handleMultiCopy(rubric.source.index, type)}
                                isHistory={isHistory} onCopy={onCopy}
                                onDelete={onDelete}
                                audio={audio}
                                setAudio={setAudio}
                                disableSound={disableSound}
                                handlePlay={handlePlay}
                />
              )}>
                {(provided: DroppableProvided, snapshot: DraggableStateSnapshot) => {
                  return (
                    <div ref={provided.innerRef}>
                      <Virtuoso
                        className={`${isHistory ? 'h-[700px]' : ''}`}
                        // logLevel={LogLevel.DEBUG}
                        ref={virtuosoRef}
                        useWindowScroll={!isHistory}
                        overscan={900}
                        components={{
                          // @ts-ignore
                          Item: HeightPreservingWrapper,
                        }}
                        data={blocks}
                        itemContent={(index, block) => {
                          return (
                            <Draggable key={block?.id + index} draggableId={block?.id}
                                       index={index}
                                       isDragDisabled={block?.type === 'control' && index === 0}>
                              {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) =>
                                <DraggableBlock
                                  provided={provided}
                                  block={block}
                                  isDragging={snapshot.isDragging}
                                  index={index}
                                  blocksSelection={blocksSelection}
                                  handleItemSelection={handleItemSelection}
                                  onDelete={onDelete} onCopy={onCopy}
                                  chapter={chapter}
                                  ids={ids} onDeleteStartEnd={onDeleteStartEnd}
                                  handleGetIndex={handleGetIndex}
                                  handleMultiCopy={(type) => handleMultiCopy(index, type)}
                                  isHistory={isHistory}
                                  audio={audio}
                                  setAudio={setAudio}
                                  disableSound={disableSound}
                                  handlePlay={handlePlay}
                                />}
                            </Draggable>
                          )
                        }}
                      />
                      <style dangerouslySetInnerHTML={{
                        __html: `
                    [data-known-size]:empty {
                        height: var(--data-known-size);
                    }
                `
                      }}/>
                    </div>
                  )
                }}
              </Droppable>
            </DragDropContext>
          }
        </div>
      </div>
      {/*<TimelineSettingModal isOpen={isTimelineImageSetting}*/}
      {/*                      handleClose={() => setIsTimelineImageSetting(false)} start={start} setStart={setStart}*/}
      {/*                      end={end} length={length}*/}
      {/*                      setEnd={setEnd} imageUrl={imageUrl} previewAudioUrl={previewAudioUrl}*/}
      {/*                      isImage={true} handleSubmit={handleSubmitImageSetting}*/}
      {/*                      uploadImage={uploadImage} loading={loadingImg}*/}
      {/*                      label={'背景画像を追加'}></TimelineSettingModal>*/}
      {/*<TimelineSettingModal isOpen={isTimelineAudioSetting}*/}
      {/*                      handleClose={() => setIsTimelineAudioSetting(false)} start={start} setStart={setStart}*/}
      {/*                      end={end} length={length}*/}
      {/*                      setEnd={setEnd} imageUrl={imageUrl}*/}
      {/*                      previewAudioUrl={previewAudioUrl}*/}
      {/*                      handleSubmit={handleSubmitAudioSetting} //import from handleSubmitAudioSetting.ts */}
      {/*                      uploadMusic={(e) => uploadMusic(e, blocks, setLoadingImg, userInfo, setAudioUrl, setAudioName, setPreviewAudioUrl)}*/}
      {/*                      loading={loadingImg} label={'音楽を追加'}></TimelineSettingModal>*/}
      {
        <Modal open={isShowModal}
               setOpen={setIsShowModal}
               title={'ブロックを選択'}
               btnSubmit={'選択したブロックを挿入する'}
               size={'md'}
               actionPosition={"between"}
               isChapterStruct={false}
               handleClose={() => {
                 setAddNewBlocks([])
                 setBlockIndex(null)
                 setIsShowModal(false)
               }}
               actionChildren={
                 <ActionModalChild addNewBlocks={addNewBlocks}
                                   handleDeleteSelectedBlock={handleDeleteSelectedBlock}
                 />
               }
               onSubmit={onAddBlocks}>
          <div className={"w-full h-full"}>
            <RightScenario
              checkTimeTrigger={isTimeTriggerBetweenStartAndEnd}
              blockIndex={blockIndex}
              isShowModal={isShowModal}
              addNewBlocks={addNewBlocks}
              setAddNewBlocks={setAddNewBlocks}
              disableGPTVersion={disableChatGPTVersion(addNewBlocks)}
            />
          </div>
        </Modal>
      }
      {/*{isHistory && <ButtonScrollTop virtuosoRef={virtuosoRef}/>}*/}
    </div>
  )
    ;
}

export default React.memo(CenterScenario);

