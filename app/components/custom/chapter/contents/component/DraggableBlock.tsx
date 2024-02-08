import React from 'react';
import {type DraggableProvided,} from "react-beautiful-dnd";
import {DraggableWrapper} from "@/app/components/custom/chapter/contents/component/DraggableWrapper";
import BlockItems from "@/app/components/custom/chapter/contents/component/BlockItems";
import {Chapter} from "@/app/types/types";
import {Block} from "@/app/types/block";

interface Props {
  provided: DraggableProvided
  block: Block
  isDragging: boolean
  index: number
  blocksSelection: Block[]
  handleItemSelection: (id: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onDelete: (item: any) => void
  onCopy: (item: any) => void
  chapter: Chapter
  ids: string[]
  onDeleteStartEnd: (index: number, type: string) => void,
  handleGetIndex: any
  handleMultiCopy: (type: string) => void
  isHistory: boolean
  audio: HTMLAudioElement
  setAudio: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disableSound: boolean
  handlePlay?: (player: any) => void
}

function DraggableBlock(props: Props) {
  const {
    provided,
    block,
    isDragging,
    index,
    blocksSelection,
    handleItemSelection,
    onDelete,
    onCopy,
    chapter,
    ids,
    onDeleteStartEnd,
    handleGetIndex,
    handleMultiCopy,
    isHistory,
    audio,
    setAudio,
    disableSound,
    handlePlay
  } = props
  const getStyle = (blocksSelection, block: Block, provided: DraggableProvided, isDragging: boolean) => {
    return {
      backgroundColor: blocksSelection.length && blocksSelection?.some(
        (selectedItem) => selectedItem?.id === block.id)
        ? 'lightgray' : 'white',
      ...(isDragging && {
        backgroundColor: `${blocksSelection?.length > 1 ? 'lightblue' : 'white'}`,
      }),
      ...provided?.draggableProps?.style,
    }
  }
  return (
    <DraggableWrapper block={block} index={index} provided={provided}
                      style={getStyle(blocksSelection, block, provided, isDragging)}
                      handleItemSelection={handleItemSelection}
                      isHistory={isHistory}>
      <BlockItems block={block} index={index} onDelete={onDelete} onCopy={onCopy}
                  chapter={chapter} ids={ids} onDeleteStartEnd={onDeleteStartEnd}
                  handleGetIndex={() => handleGetIndex(index)}
                  handleMultiCopy={handleMultiCopy} audio={audio} setAudio={setAudio} disableSound={disableSound}
                  handlePlay={handlePlay}
      />
    </DraggableWrapper>
  );
}

export default DraggableBlock;
