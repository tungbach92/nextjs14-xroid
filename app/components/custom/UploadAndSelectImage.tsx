import React, {useEffect, useState} from 'react';
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtom, useAtomValue} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {CircularProgress} from "@mui/material";
import {isFunction} from "lodash";
import {useImageList} from "@/app/components/imagePage";
import Modal from "@/app/components/custom/Modal";
import {BaseDeleteModal} from "@/app/components/base";
import {ImageAtom} from "@/app/store/atom/listImages";
import MainImage from "@/app/components/imagePage/MainImage";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {Folder} from "@/app/types/folders";

type props = {
  url: string
  id: string
  text?: string
  index?: number
  borderColor?: string
  uploadImage?: (value) => void
}

function UploadAndSelectImage({id, text, index, borderColor, uploadImage, url}: props) {
  const [isHover, setIsHover] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const {listImages} = useImageList({})
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [selectedImageInDialog, setSelectedImageInDialog] = useState<ImageAtom>(null)
  const [isSubFolder, setIsSubFolder] = useState<boolean>(false)
  const [folderId, setFolderId] = useState<string>('')

  const imageFolders = useAtomValue(imageFoldersAtom)
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)
  const [subImageFolders, setSubImageFolders] = useState<Folder[]>([]);
  useGetImageFolders();

  useEffect(() => {
    if (!imageFolders?.length || !selectedImageFolder?.id) return
    const result = imageFolders?.filter(folder => folder.parentId === selectedImageFolder.id)
    setSubImageFolders(result)
  }, [imageFolders, selectedImageFolder?.id])

  const handleRemove = () => {
    if (isFunction(uploadImage))
      uploadImage('')
    url = ''
    setIsHover(false)
    setConfirmDelete(false)
  }

  const handleUpload = async (event) => {
    try {
      setLoading(true)
      if (!event) return;
      const file = event.target.files[0];
      url = await handleUploadFile(file, userInfo.user_id)
      if (isFunction(uploadImage))
        uploadImage(url)
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

  const handleSelectImage = (item: ImageAtom) => {
    setSelectedImageInDialog(item)
  }

  const handleSubmitImage = () => {
    if (isFunction(uploadImage))
      uploadImage(selectedImageInDialog.url)
    url = selectedImageInDialog.url
    setOpenModal(false)
  }

  const handleCloseImageModal = () => {
    setOpenModal(false)
    setSelectedImageInDialog(null)
  }

  return (
    <div className={'max-w-fit flex flex-col items-center'}>
      {text && <div className={'text-[#254C71] uppercase text-[14px] mb-1'}>{text}</div>}
      <div
        style={{
          borderColor: `${borderColor ? borderColor : "#254C71"}`
        }}
        className={`w-[60px] h-[60px] rounded-md border border-dashed flex items-center justify-center`}>
        {
          loading ? <CircularProgress size={20}/> :
            <div>
              {
                url ?
                  <div className={"relative flex"}>
                    <img src={url}
                         alt={'upload'}
                         className={'w-14 h-14 object-contain cursor-pointer'}
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
                             width={30}
                             height={30}
                             onMouseEnter={() => {
                               setIsHover(true)
                             }}
                             src={'/images/scenario-template/deleteIcon.svg'} alt={'delete'}
                             className={'m-auto cursor-pointer'}/>
                      </div>
                    }
                  </div>
                  :
                  <div>
                    <label htmlFor={`upload-image-${id}-${index}`}>
                      <img src={"/icons/image-icon.svg"} alt={'select'}
                           className={'cursor-pointer'}
                           onClick={e => handleOpenSelectImage(e)}
                      />
                    </label>
                    <label htmlFor={`upload-image-${id}-${index}`}>
                      <img src={'/images/upload.svg'} alt={'upload'}
                           className={'m-auto cursor-pointer'}/>
                    </label>
                    <input
                      id={`upload-image-${id}-${index}`}
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={event => handleUpload(event)}
                    />
                  </div>
              }
            </div>
        }
      </div>
      {
        openModal &&
        <Modal open={openModal} setOpen={setOpenModal}
               onSubmit={handleSubmitImage}
               title={'画像を選択してください。'}
               handleClose={handleCloseImageModal}
               btnSubmit={'選択する'} size={'lg'} bgColor={'#F5F7FB'} isBtnGroupCenter={true}>
          <MainImage subImageFolders={subImageFolders} isSubFolder={isSubFolder} setIsSubFolder={setIsSubFolder}
                     folderId={folderId} setFolderId={setFolderId} isNotPage={true} isOnlyImage={true}
                     handleSelectImage={handleSelectImage} selectedImageInDialog={selectedImageInDialog}/>
        </Modal>
      }
      <BaseDeleteModal label={'削除してもよろしいですか？'} isOpen={confirmDelete} handleClose={() => setConfirmDelete(false)}
                       handleDelete={handleRemove}/>
    </div>
  );
}

export default UploadAndSelectImage;
