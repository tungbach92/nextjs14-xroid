import React, {useState} from 'react';
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {CircularProgress} from "@mui/material";
import {isFunction} from "lodash";
import Modal from "@/app/components/custom/Modal";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import {toast} from "react-toastify";
import {useImageByFolderId} from "@/app/hooks/useImageByFolderId";
import {useAtomValue} from "jotai";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";

type props = {
  id?: string
  image?: string
  index?: number
  onChangeData?: (value: any) => void
  imageWidth?: number
  imageHeight?: number
  uploadOrSelectClassName?: string
  iconSize?: number
}

function UploadOnlyImage({
                           id,
                           image,
                           index,
                           onChangeData,
                           imageHeight = 210,
                           imageWidth = 180,
                           uploadOrSelectClassName,
                           iconSize = 56
                         }: props) {
  useGetImageFolders()
  const [isHover, setIsHover] = useState(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [loading, setLoading] = useState<boolean>(false)
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const {listImages, loadingImages} = useImageByFolderId(selectedImageFolder?.id)

  const handleRemove = () => {
    try {
      if (isFunction(onChangeData))
        onChangeData('')
      setIsHover(false)
    } catch (e) {
      console.log(e);
    } finally {
      setConfirmDelete(false)
    }
  }

  const uploadImage = async (event) => {
    try {
      setLoading(true)
      if (!event) return;

      const filesEvent = event.target.files;
      if (!filesEvent.length) return;
      let i = 0;
      for (const file of filesEvent) {
        if (file.type === 'image/gif') return toast.error('表紙の画像形成が正しくありません。静止画を使ってください。')
        image = await handleUploadFile(file, userInfo.user_id)
        i++;
      }
      let newData = image;
      if (isFunction(onChangeData))
        onChangeData(newData)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  };

  const handleOpenSelectImage = (event) => {
    event.preventDefault();
    setOpenModal(true)
  }

  const handleOpenDeleteDialog = () => {
    setConfirmDelete(true)
  }

  const handleSelectImage = (item) => {
    image = item.url
    if (isFunction(onChangeData))
      onChangeData(image)
    setOpenModal(false)
  }


  return (
    <div className={'max-w-fit flex flex-col items-center'}>
      {
        loading ? <CircularProgress size={20}/> :
          <div>
            {
              image ?
                <div className={"relative flex"}>
                  <img src={image}
                       alt={'upload'}
                       width={imageWidth}
                       height={imageHeight}
                       className={`object-contain cursor-pointer`}
                       onMouseEnter={() => {
                         setIsHover(true)
                       }}
                       onMouseLeave={() => {
                         setIsHover(false)
                       }}
                  />
                  {
                    isHover &&
                    <div
                      className={"absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"}>
                      <img onClick={handleOpenDeleteDialog}
                           width={40}
                           height={40}
                           onMouseEnter={() => {
                             setIsHover(true)
                           }}
                           src={'/images/scenario-template/deleteIcon.svg'} alt={'delete'}
                           className={'m-auto cursor-pointer'}/>
                    </div>
                  }
                </div>
                :
                <div className={`space-x-4 ${uploadOrSelectClassName}`}>
                  <label htmlFor={`upload-image-${id}-${index}`}>
                    <img src={"/icons/image-icon.svg"} alt={'select'}
                         className={`cursor-pointer w-[${iconSize}px] h-[${iconSize}px]`}
                         onClick={e => handleOpenSelectImage(e)}
                    />
                  </label>
                  <label htmlFor={`upload-image-${id}-${index}`}>
                    <img src={'/images/upload.svg'} alt={'upload'}
                         className={`m-auto cursor-pointer w-[${iconSize}px] h-[${iconSize}px]`}/>
                  </label>
                  <input
                    id={`upload-image-${id}-${index}`}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={event => uploadImage(event)}
                  />
                </div>
            }
          </div>
      }

      {
        openModal &&
        <Modal open={openModal} setOpen={setOpenModal}
               title={'画像を選択してください。'}
               handleClose={() => setOpenModal(false)}
               btnSubmit={'選択する'}>
          {
            loadingImages ? <CircularProgress size={20}/> :
              <div className={'flex justify-center items-center max-w-6xl overflow-auto '}>
                {
                  <ImageList sx={{width: 400, height: 320}} cols={3} rowHeight={104}>
                    {listImages?.map((item, index: number) => (
                      <ImageListItem key={item.url + index}>
                        <img
                          src={item.url}
                          className={'w-24 h-24 object-contain cursor-pointer'}
                          alt={'image'}
                          loading="lazy"
                          onClick={() => handleSelectImage(item)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                }
              </div>
          }

        </Modal>
      }
      {
        confirmDelete &&
        <Modal
          dividers={false}
          size={'xs'}
          open={confirmDelete} setOpen={setConfirmDelete}
          title={"削除しますか？"} btnSubmit={"削除"}
          onSubmit={() => handleRemove()}
          handleClose={() => setConfirmDelete(false)}>
          <div></div>
        </Modal>
      }
    </div>
  );
}

export default UploadOnlyImage;
