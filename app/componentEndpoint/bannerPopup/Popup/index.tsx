import React, {useEffect, useState} from 'react';
import ImageBannerPopup from "@/app/components/bannerPopup/data/ImageBannerPopup";
import {PopupData} from "@/app/types/types";
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  Droppable,
  type DroppableProvided
} from "react-beautiful-dnd";
import {toast} from "react-toastify";
import {updatePopupIndex} from "@/app/common/commonApis/bannerAndUploadApis";

type Props = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  openLink: (link: string) => void,
  handleDelete: (item: PopupData) => void,
  onChangeHidden: (item: PopupData) => void,
  handleEdit: (item: PopupData) => void,
  imagePopupData: PopupData[],
}

function Popup({openLink, onChangeHidden, handleEdit, handleDelete, imagePopupData, isOpen, setIsOpen}: Props) {
  const [popups, setPopups] = useState<PopupData[]>([])

  useEffect(() => {
    setPopups(imagePopupData)
  }, [imagePopupData])

  const onDragEnd = async (result) => {
    if (!result.destination || result?.destination?.index === result?.source?.index) return;
    const _popups = [...popups]
    const [reorderedItem] = _popups.splice(result.source.index, 1);
    _popups.splice(result.destination.index, 0, reorderedItem);
    try {
      const data = {
        index: _popups?.length - (result.destination.index + 1),
        id: reorderedItem.id
      }
      setPopups(_popups?.map((item, index) => {
        return {
          ...item,
          index: _popups?.length - index
        }
      }))
      await updatePopupIndex(data)
      toast.success('並び替えが完了しました。')
    } catch (e) {
      console.log(e);
      toast.error('並び替えが失敗しました。')
      setPopups(imagePopupData)
    }
  }

  return (
    <div className={'mt-6'}>
      {!popups?.length && <div
        className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold mb-4`}>ポップアップがございません。</div>}
      {
        popups?.length > 0 &&
        <DragDropContext onDragEnd={onDragEnd} direction="horizontal">
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided: DroppableProvided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}
                   style={{
                     // display: 'flex',
                     // flexDirection: 'column',
                     // alignItems: 'flex-start',
                     // gap: '10px',
                   }}
                   className={'inline-grid grid-cols-4 gap-4 w-full'}
              >
                {
                  popups?.map((item: PopupData, index: number) => {
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

export default Popup;
