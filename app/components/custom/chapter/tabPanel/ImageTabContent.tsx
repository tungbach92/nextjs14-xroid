import React, {useState} from 'react';
import ImageCustom from "@/app/components/custom/ImageCustom";
import Button from "@mui/material/Button";
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useImagesListFireStore} from "@/app/hooks/useImagesListFireStore";
import CircularProgress from '@mui/material/CircularProgress';
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/app/configs/firebase";
import {useAtom} from "jotai";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import SideBarRightContent from "@/app/components/custom/chapter/tabPanel/SideBarRightContent";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";
import {useSubImage} from "@/app/hooks/useSubImage";
import {Image} from "@/app/types/types";


interface Img {
  url: string
  file: any
}

type props = {
  imagesData: Array<Img>
  setImagesData: React.Dispatch<React.SetStateAction<any>>
  handleChangeImage: (event: React.ChangeEvent<HTMLInputElement>) => void
  onAddBlock: (type: string) => void
  isShowModal: boolean
}

function ImageTabContent({
                           imagesData,
                           setImagesData,
                           handleChangeImage,
                           onAddBlock,
                           isShowModal
                         }: props) {
  useGetImageFolders()
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const {listImages, loading} = useImagesListFireStore();
  const [imageFolders, setImageFolders] = useAtom(imageFoldersAtom)
  const [selectedImageFolder, setSelectedImageFolder] = useAtom(selectedImageFolderAtom)
  const [openTopLeftMenu] = useAtom(topLeftMenuOpen)
  const subFolders = imageFolders.filter(item => item.parentId === selectedImageFolder.id)?.map(item => item.id)
  const {listSubImages,loadingSubImages} = useSubImage(subFolders)
  const allImages = listImages?.concat(listSubImages) ?? [] as Image[]
  const handleUploadFiles = async () => {
    try {
      if (!imagesData.length) return;
      setLoadingImage(true)
      await Promise.all(imagesData.map(async file => {
        const _file = file.file
        if (!_file) return
        const url = await handleUploadFile(_file, 'templates');
        if (!url) return
        await axios.post(`/v2/images/create`, {url: url, folderId: selectedImageFolder.id});
      }))

    } catch (e) {
      console.log(e);
    } finally {
      setImagesData([])
      setLoadingImage(false)
    }

  }

  const handleDeleteImages = (i) => {
    if (!i.id) return;
    const imageRef = doc(db, 'images', i.id);
    setDoc(imageRef, {isDeleted: true}, {merge: true})
  }

  const innerWidth = window.innerWidth
  const checkScreen = innerWidth > 1665

  return (
    <div className={'-pr-[30px]'}>
      <div className={'justify-between -mr-4'}>
        {
          isShowModal ?
            <div className={'flex gap-5 flex-wrap justify-between ml-[80px] mr-[10px]'}>
              <Button className={'text-[10px]'} variant="contained" component="label"
                      startIcon={<img src={'/images/addImageIcon.svg'} alt={''}/>}>
                画像追加
                <input
                  onChange={(event) => handleChangeImage(event)}
                  hidden accept="image/*" multiple type="file"/>
              </Button>
            </div>
            :
            <>
              {
                <div className={'flex gap-2 flex-wrap justify-center'}>
                  <Button
                    className={`${openTopLeftMenu ? 'w-[150px]' : ' w-[190px]'} ${checkScreen ? 'w-[250px] text-[14px]' : 'w-[200px] text-[10px]'}`}
                    variant="contained"
                    component="label"
                    startIcon={<img className={'absolute top-[20%] left-2 w-[20px]'}
                                    src={'/images/addImageIcon.svg'} alt={''}/>}>
                    画像追加
                    <input
                      onChange={(event) => handleChangeImage(event)}
                      hidden accept="image/*" multiple type="file"/>
                  </Button>
                </div>
              }

            </>
        }
        <SideBarRightContent isShowModal={isShowModal} folders={imageFolders} setFolders={setImageFolders}
                             selectedFolder={selectedImageFolder}
                             setSelectedFolder={setSelectedImageFolder} folderType={'image'} isInChapter={true}/>

        {
          imagesData.length > 1 &&
          <LoadingButton loading={loadingImage} onClick={handleUploadFiles}
                         variant="contained">アップロード</LoadingButton>
        }

      </div>
      <div className={'flex justify-center max-h-[60vh] overflow-y-auto'}>
        {
          (!loading && allImages?.length === 0 && loadingSubImages && !listSubImages) && <div className={'m-2'}>画像がございません。</div>
        }
        {
          loading && !listImages && loadingSubImages && !listSubImages && <CircularProgress color={"secondary"} className={"mt-10"} size={30}/>
        }
        {
          !loading && allImages?.length > 0 &&
          <div className={'w-full flex flex-wrap gap-2 pl-2 pt-3'}>
            {
              allImages.map((i: any) => {
                return <ImageCustom
                  width={checkScreen ? 90 : 70} height={checkScreen ? 90 : 70}
                  className={'rounded'}
                  src={i?.url} key={i?.id} onAddImageBlock={onAddBlock}
                  handleDelete={() => handleDeleteImages(i)}/>
              })}
          </div>

        }
      </div>
    </div>
  );
}

export default ImageTabContent;
