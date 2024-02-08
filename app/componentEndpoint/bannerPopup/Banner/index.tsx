import React, {useEffect, useState} from 'react';
import ImageBannerPopup from "@/app/components/bannerPopup/data/ImageBannerPopup";

import {
    DragDropContext,
    Draggable,
    type DraggableProvided,
    type DraggableStateSnapshot,
    Droppable,
    type DroppableProvided
} from "react-beautiful-dnd";
import {BannerData} from "@/app/types/types";
import {updateBannerIndex} from "@/app/common/commonApis/bannerAndUploadApis";
import {toast} from "react-toastify";

type Props = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  openLink: (link: string) => void,
  handleDelete: (item: BannerData) => void,
  onChangeHidden: (item: BannerData) => void,
  handleEdit: (item: BannerData) => void,
  imageBannerData: BannerData[],
}

function Banner({openLink, onChangeHidden, handleEdit, handleDelete, imageBannerData, isOpen, setIsOpen}: Props) {
  const [banners, setBanners] = useState<BannerData[]>([])

  useEffect(() => {
    setBanners(imageBannerData)
  }, [imageBannerData])
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const _banners = [...banners]
    const [reorderedItem] = _banners.splice(result.source.index, 1);
    _banners.splice(result.destination.index, 0, reorderedItem);
    try {
      const data = {
        index: _banners?.length - result.destination.index - 1,
        id: reorderedItem.id
      }
      setBanners(_banners?.map((item, index) => {
        return {
          ...item,
          index: _banners?.length - index
        }
      }))
      await updateBannerIndex(data)
      toast.success('並び替えが完了しました。')
    } catch (e) {
      console.log(e);
      toast.error('並び替えが失敗しました。')
      setBanners(imageBannerData)
    }
  }
  return (
      <div className={'mt-6 overflow-auto'}>
        {!banners?.length && <div
            className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold mb-4`}>バナーがございません。</div>}
          {
              <DragDropContext onDragEnd={onDragEnd} direction="horizontal">
                  <Droppable droppableId="droppable" direction="horizontal" >
                      {(provided: DroppableProvided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}
                               style={{
                                   display: 'flex',
                                   flexDirection: 'row',
                                   alignItems: 'flex-start',
                                   gap: '10px',
                                   paddingBottom: "20px"
                       }}
                  >
                    {
                      banners?.map((item: BannerData, index: number) => {
                        return (
                          <Draggable key={item?.id} draggableId={item?.id} index={index} direction="horizontal">
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div key={index} className={''}>
                                  <ImageBannerPopup
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                    isBanner
                                    src={item.url}
                                    onEdit={() => handleEdit(item)}
                                    handleDelete={() => handleDelete(item)}
                                    onOpenLink={() => openLink(item.pageUrl)}
                                    onchangeHide={() => onChangeHidden(item)}
                                    hide={item.isHidden}
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
        }
      </div>
  );
}

export default Banner;
