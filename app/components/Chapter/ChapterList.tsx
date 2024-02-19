import React, {useState} from 'react';
import ChapterItem from "@/app/components/Chapter/ChapterItem";
import {useGetChapterByContentId} from "@/app/hooks/useGetChaptersByContentId";
import RemoveComponent from "@/app/components/base/RemoveComponent";
import {deleteDataChapter, updateDataChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";
import {useRouter, useSearchParams} from "next/navigation";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {toDate} from "../../../common/date";
import {cloneDeep} from "lodash";
import AddBannerDialog from "@/app/components/Home/ContentLayout/AddBannerDialog";
import {ChapterWithPurChaseSetting} from "@/app/common/chapterPurchaseSetting";
import CircularProgress from "@mui/material/CircularProgress";
import {VimeoChapter, YoutubeChapter} from "@/app/types/types";
import SettingChapterCubeDialog from "@/app/components/DialogCustom/SettingChapterCubeDialog";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";


type Props = {
  contentId: string,
  title: string,
  isSubFolder?: boolean,
}

function ChapterList({contentId, title, isSubFolder}: Props) {
  const {chapters, setChapters, loadingChapters} = useGetChapterByContentId(contentId)
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get('subFolder')
  const [item, setItem] = useState<ChapterWithPurChaseSetting | undefined>(undefined)
  const [openUpdateBanner, setOpenUpdateBanner] = useState<boolean>(false)
  const [openChangeCube, setOpenChangeCube] = useState<boolean>(false)
  const [cube, setCube] = useState<number>(0)


  const handleDelete = async (item) => {
    try {
      await deleteDataChapter(item.id)
      toast.success('削除しました。')
    } catch (e) {
      toast.error('削除できません。')
      console.log(e)
    }
  }

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const _chapters = cloneDeep(chapters)
    const [reorderedItem] = _chapters.splice(result.source.index, 1);
    _chapters.splice(result.destination.index, 0, reorderedItem);
    const newChapters = _chapters.map((item, index) => {
      return {
        ...item,
        chapterIndex: index
      }
    })
    setChapters(newChapters)
    try {
      newChapters.forEach((item, index) => {
        const data = {
          ...item,
          publishedDate: item.publishedDate ? toDate(item.publishedDate) : null
        }
        updateDataChapter(data)
      })
      toast.success('チャプターを更新しました。', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error('チャプターを更新できませんでした。', {autoClose: 3000})
    }
  }
  const onChangeCube = async () => {
    if (!item) return;
    const _item = cloneDeep(item)
    _item.cube = cube
    try {
      await updateDataChapter(_item)
      toast.success('キューブを更新しました。', {autoClose: 3000})
    } catch (e) {
      toast.error('キューブを更新できませんでした。', {autoClose: 3000})
    } finally {
      setOpenChangeCube(false)
    }
  }

  return (
    <div className={`py-3 bg-white rounded-md w-full`}>
      <div className='h-[580px]'>
        <RemoveComponent contentId={contentId}
                         subFolder={isSubFolder} chapters={chapters}
                         title={title} subFolderId={folderId}/>
        {
          (loadingChapters || (!loadingChapters && !chapters)) && <CircularProgress className={'flex mx-auto mt-5'}/>
        }

        <div className='h-[410px] overflow-auto mt-2'>
          {!chapters?.length && <div
            className={`flex items-center w-full bg-white rounded-md justify-center text-black h-full font-semibold mb-4`}>コンテンツがございません。</div>}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {
                    chapters?.map((item, index) => {
                      if (item?.isDeleted === true) return null;
                      const isExtraChapter = 'extraChapterType' in item;
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                              <div key={item.id} className={'pb-2'}>
                                <ChapterItem
                                  extraChapter={item as YoutubeChapter | VimeoChapter}
                                  isExtraChapter={isExtraChapter}
                                  chapter={item}
                                  contentId={contentId}
                                  handleDelete={() => handleDelete(item)}
                                  onUpdateBanner={() => {
                                    setItem(item)
                                    setOpenUpdateBanner(true)
                                  }}
                                  onchangeCube={() => {
                                    setItem(item)
                                    setOpenChangeCube(true)
                                    setCube(item.cube)
                                  }}
                                  banner={item.isBanner}
                                  name={item.title}
                                  image={item.thumbnail || '/icons/no-image-frees.png'}
                                  cube={item.cube}
                                  ticket={true}
                                  purchaseSetting={item.purchaseSetting}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <AddBannerDialog
          maxIndex={chapterIndex(chapters)}
          open={openUpdateBanner}
          setOpen={setOpenUpdateBanner}
          oldBanner={item}
        />
      </div>
      <SettingChapterCubeDialog cube={cube} setCube={setCube}
                                openChangeCube={openChangeCube}
                                setOpenChangeCube={setOpenChangeCube}
                                onChangeCube={() => onChangeCube()}
      />
    </div>
  );
}

export default ChapterList;
