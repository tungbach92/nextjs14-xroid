import ChapterItem from "@/app/components/Chapter/ChapterItem";
import React, {useEffect, useMemo} from "react";
import moment from 'moment-timezone'
import {getTimeString} from "../../../common/getTimeString";
import {cloneDeep} from "lodash";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {updateDataChapter, updateIndexChapter} from "@/app/common/commonApis/chaptersApi";
import AddBannerDialog from "@/app/components/Home/ContentLayout/AddBannerDialog";
import {Chapter, ExtraChapter, YoutubeChapter} from "@/app/types/types";
import {toast} from "react-toastify";
import {toDate} from "../../../common/date";
import {ChapterWithPurChaseSetting} from "@/app/common/chapterPurchaseSetting";
import {ContentState} from "@/app/types/content";
import SettingChapterCubeDialog from "@/app/components/DialogCustom/SettingChapterCubeDialog";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";

interface ChapterBannerContentProps {
  chapters: Chapter[] | ExtraChapter[],
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>,
  contentId: string,
  hiddenAction?: boolean,
  cubeDefault?: number
  state: ContentState
  setState: React.Dispatch<React.SetStateAction<ContentState>>
}

export default function ChapterBannerContent({chapters, setChapters, contentId,state, setState, hiddenAction = false, cubeDefault = 0}: ChapterBannerContentProps) {
  const [openUpdateBanner, setOpenUpdateBanner] = React.useState(false)
  const [item, setItem] = React.useState<ChapterWithPurChaseSetting | undefined>(undefined)
  const [openChangeCube, setOpenChangeCube] = React.useState(false)
  const [cube, setCube] = React.useState<number>(0)
  useEffect(() => {
    if (item || cubeDefault) {
      setCube(item?.cube || cubeDefault)
    }
  }, [item, cubeDefault])

  const columns = useMemo(() => {
    const columns: Chapter[][] = [[]];
    chapters?.forEach((item) => {
      const currentColumn = columns[columns.length - 1];
      if (currentColumn.length < 7) {
        currentColumn.push(item);
      } else {
        columns.push([item]);
      }
    });
    return columns
  }, [chapters]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const oldChapters = cloneDeep(columns.flat())
    const sourceColumnIndex = result.source.droppableId;
    const destinationColumnIndex = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceColumnIndex === destinationColumnIndex && sourceIndex === destinationIndex) {
      return;
    }
    const sourceColumn = columns[sourceColumnIndex];
    const destinationColumn = columns[destinationColumnIndex];
    if (destinationColumn.length === 7 && sourceColumnIndex !== destinationColumnIndex) {
      for (let i = 0; i < sourceColumn.length; i++) {
        if (sourceColumn[i].id === destinationColumn[6].id) {
          sourceColumn.splice(i, 1);
          break;
        }
      }
    }
    const [removed] = sourceColumn.splice(sourceIndex, 1);
    destinationColumn.splice(destinationIndex, 0, removed);
    const newChapters: Chapter[] = cloneDeep(columns.flat()).map((item, index) => {
      return {
        ...item,
        chapterIndex: index
      }
    });
    try {
      const indexData = newChapters.map(item => {
        return {chapterId: item.id, chapterIndex: item.chapterIndex}
      })
      await updateIndexChapter({indexData, contentId})
      setChapters(newChapters)
      toast.success('チャプターを更新しました', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      setChapters(oldChapters)
      toast.error('チャプターを更新できませんでした', {autoClose: 3000})
    }
  }

  const onChangeCube = async () => {
    try {
      let data = {
        ...item,
        publishedDate: item.publishedDate ? toDate(item.publishedDate) : null,
        cube: cube
      }
      let listChanged = state.listChanged || [];
      listChanged.push(item.id);
      setState({...state, listChanged});

      if (data.purchaseSetting) delete data.purchaseSetting;
      await updateDataChapter(data)
      toast.success('チャプターを更新しました', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error('チャプターを更新できませんでした', {autoClose: 3000})
    } finally {
      setOpenChangeCube(false)
      setCube(0)
    }
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex bg-[#f3f4f6] overflow-auto max-w-max gap-4">
          {columns.map((columnItems, columnIndex) => (
            <div key={columnIndex} className="h-full bg-white rounded py-3">
              <Droppable droppableId={`${columnIndex}`}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {columnItems.map((item, itemIndex) => {
                      const isExtraChapter = 'extraChapterType' in item;
                      return (
                        <Draggable key={itemIndex} draggableId={`${columnIndex}-${itemIndex}`} index={itemIndex}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div key={itemIndex} className={'pt-2 min-w-[330px] max-w-[300px] m-auto'}>
                                <ChapterItem
                                  isExtraChapter={isExtraChapter}
                                  extraChapter={item as YoutubeChapter | ExtraChapter}
                                  chapter={item}
                                  contentId={item.contentId}
                                  onUpdateBanner={() => {
                                    setItem(item)
                                    setOpenUpdateBanner(true)
                                  }}
                                  onchangeCube={() => {
                                    setItem(item)
                                    setOpenChangeCube(true)
                                  }}
                                  cube={item?.cube}
                                  inContent={true}
                                  date={item?.publishedDate ? moment.tz(getTimeString(item?.publishedDate), 'Asia/Tokyo').format("YYYY/MM/DD(ddd)") : ''}
                                  ticket={true}
                                  banner={item?.isBanner}
                                  name={item?.title}
                                  image={item?.thumbnail || '/icons/no-image-frees.png'}
                                  purchaseSetting={item?.purchaseSetting}
                                  hiddenAction={hiddenAction}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <AddBannerDialog
        maxIndex={chapterIndex(chapters)}
        open={openUpdateBanner}
        setOpen={setOpenUpdateBanner}
        oldBanner={item}
      />
      <SettingChapterCubeDialog cube={cube}
                                setCube={setCube}
                                openChangeCube={openChangeCube}
                                setOpenChangeCube={setOpenChangeCube}
                                onChangeCube={onChangeCube}
      />
    </div>
  )
}
