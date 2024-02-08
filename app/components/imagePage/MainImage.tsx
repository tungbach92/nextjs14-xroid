import {useImageList} from "@/app/components/imagePage/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import {Button} from "@mui/material";
import AddIcon from "@/app/common/data/svgData/add-icon.svg";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import FolderIcon from "@/app/common/data/svgData/folder-open-icon.svg";
import dayjs from "dayjs";
import ActionSubFolderPopover from "@/app/components/Home/ActionSubFolder";
import ActionIcon from "@/app/common/data/svgData/action-icon.svg";
import ImageCustom from "@/app/components/custom/ImageCustom";
import {PreviewImageModal} from "@/app/components/imagePage/widgets";
import {BaseDeleteModal} from "@/app/components/base";
import SideBarRight from "@src/components/Layout/Sidebar/side-bar-right";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAtom} from "jotai";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {Folder} from "@/app/types/folders";
import LoadingButton from "@mui/lab/LoadingButton";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import axios from "axios";
import ReactPlayer from "react-player";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {Image} from "@/app/types/types";
import {ImageAtom} from "@/app/store/atom/listImages";

type MainImageProps = {
  subImageFolders?: Folder[]
  isSubFolder?: boolean,
  folderId?: string
  isNotPage?: boolean
  isOnlyImage?: boolean
  handleSelectImage?: (item: ImageAtom) => void
  selectedImageInDialog?: ImageAtom
  setIsSubFolder?: React.Dispatch<React.SetStateAction<boolean>>
  setFolderId?: React.Dispatch<React.SetStateAction<string>>
}

interface ImageWithPlay extends Image {
  isPlaying: boolean
}

const MainImage = ({
  subImageFolders,
  isSubFolder = false,
  folderId = '',
  isNotPage = false,
  isOnlyImage = false,
  handleSelectImage,
  selectedImageInDialog,
  setIsSubFolder,
  setFolderId
}: MainImageProps) => {
  const router = useRouter();
  const {query: {id}} = router;
  const [imageFolders, setImageFolders] = useAtom(imageFoldersAtom)
  const [selectedImageFolder, setSelectedImageFolder] = useAtom(selectedImageFolderAtom)
  const [open, setOpen] = useState(false);
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [newLists, setNewLists] = useState<ImageWithPlay[]>([])
  const {
    handleChangeImage,
    handleClosePreview,
    handleCloseDeleteModal,
    handleDeleteImage,
    handleDelete,
    handleModalDelete,
    uploadImage,
    isloading,
    setIsloading,
    img,
    isOpen,
    selectedImage,
    listImages,
    loading,
    listVideos
  } = useImageList({folderId: folderId});
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const handleUploadIVideo = async (event) => {
    setLoadingBtn(true)
    if (!event.target.files[0]) return
    const url = await handleUploadFile(event.target.files[0], userInfo?.user_id, 'videos')
    try {
      await axios.post(`/v2/images/create`, {
        url: url,
        folderId: folderId || selectedImageFolder.id,
        mediaType: "video"
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingBtn(false)
    }
  }

  useEffect(() => {
    if (listVideos?.length > 0) {
      const _newLists = listVideos?.map((item) => {
        return {
          ...item,
          isPlaying: false
        }
      })
      setNewLists(_newLists)
    }
  }, [listVideos]);
  const handlePlay = (video) => {
    const _newLists = newLists?.map((item) => {
      return {
        ...item,
        isPlaying: item.id === video.id ? !item.isPlaying : false
      }
    })
    setNewLists(_newLists)
  }

  const handleClickSubFolder = (folder) => {
    if (isNotPage && folder?.id) {
      setIsSubFolder(true)
      setFolderId(folder.id)
      return
    }
    router.push(`/images/subFolder/${folder.id}`)
  }

  const hanldleClickBackFolder = () => {
    if (isNotPage) {
      setIsSubFolder(false)
      setFolderId('')
      return
    }
    router.push(`/images`)
  }


  return (
    <div className={`${!isNotPage && 'flex flex-col justify-between px-0'} w-full inline-flex px-2`}>
      <div className="w-full p-10 relative tablet:pr-[110px]">
        {isSubFolder && <div className={'mb-8'}><Button variant='contained'
                                                        onClick={hanldleClickBackFolder}>戻る</Button></div>}
        {!isSubFolder && (
          <div className={'mb-8'}>
            <Button
              variant='text'
              className='flex items-center gap-3 mb-3 -ml-1.5 text-[#9B9B9B] normal-case'
              onClick={() => setOpen(true)}
              disabled={isNotPage}
            >フォルダ{!isNotPage &&
              <span className='w-5 h-5 bg-[#1976D2] rounded-full'><AddIcon/></span>
            }
            </Button>
            {
              open &&
              <AddSubFolderDialog open={open} setOpen={setOpen} isSubFolder={true} parentId={selectedImageFolder?.id}
                                  setFolders={setImageFolders} folderType={'image'}/>
            }
            {
              subImageFolders?.length > 0 ? <div className='flex flex-col gap-4'>
                  <div className="overflow-y-auto max-h-[160px] w-full">
                    <table className="w-full">
                      <thead>
                      <tr>
                        <th className='text-start'>名前</th>
                        <th className='text-center'>作成日</th>
                        {!isNotPage && <th className='text-end'>編集</th>
                        }</tr>
                      </thead>
                      <tbody>
                      {
                        subImageFolders?.length > 0 && subImageFolders.map((item) => {
                          return (
                            <tr key={item.id}>
                              <th>
                                <Button
                                  onClick={() => handleClickSubFolder(item)}
                                  className='flex items-center justify-start gap-3 text-black'>
                                  <FolderIcon fill='gray' width={20} height={20}/>
                                  {item.name}
                                </Button>
                              </th>
                              <td className='text-center'>{dayjs(item.updatedAt).format('DD/MM/YYYY')}</td>
                              {!isNotPage && <td className='text-end'>
                                <ActionSubFolderPopover subFolder={item}
                                                        icon={<ActionIcon className='cursor-pointer'/>}
                                                        folderType={'image'}/>
                              </td>}
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div> :
                <div
                  className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold mb-4`}>フォルダがございません。</div>
            }
          </div>
        )}
        {(isloading && !isOpen.modalPreview) && <LinearProgress/>}
        {!isNotPage &&
          <div className={'flex gap-4'}>
            <Button disabled={isloading} variant="contained" component="label" className={'mb-8'}
                    startIcon={<img src={"/images/addImageIcon.svg"} alt={""}/>}>
              画像追加
              <input onChange={handleChangeImage} hidden accept="image/*" multiple type="file"/>
            </Button>
            <LoadingButton
              loading={loadingBtn}
              className={'h-9'}
              disabled={isloading}
              variant={'contained'}
              aria-label="upload video"
              component="label"
              startIcon={<img src={'/icons/content/white_video_icon.svg'} alt={'video'}/>}
            >
              動画追加
              <input
                id={`upload-image`}
                hidden
                accept="video/*"
                type="file"
                onChange={event => handleUploadIVideo(event)}
              />
            </LoadingButton>
          </div>
        }
        <div className={'text-black pb-5 font-bold'}>
          画像
        </div>
        <div className="relative grid grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-5 desktop:grid-cols-8 gap-6">
          {listImages?.length > 0 ? listImages?.map((img) => {
            return (
              <ImageCustom
                className={`!w-[110px] !h-[110px] rounded-lg ${selectedImageInDialog?.id === img?.id && 'border-2 border-solid border-blue-600'}`}
                img={img}
                src={img.url}
                key={img.id}
                isShowAddButton={false}
                handleDelete={() => handleModalDelete(img)}
                isNotPage={isNotPage}
                handleSelectImage={handleSelectImage}
              />
            );
          }) : <div
            className='absolute w-full flex items-center bg-white rounded-md justify-center text-black h-12 font-semibold'>画像がございません。</div>
          }

        </div>
        {!isNotPage &&
          <>
            <div className={'text-black py-5 font-bold'}>
              ビデオ
            </div>
            <div className={'flex gap-4 flex-wrap items-end'}>
              {
                newLists && newLists?.map((video) => {
                  if (video.folderId !== selectedImageFolder?.id && video.folderId !== folderId) return null;
                    return (
                      <div key={video.id} className={'relative group/item bg-black'}>
                        <ReactPlayer url={video.url}
                                     onPlay={() => handlePlay(video)}
                                     width={'200px'}
                                     height={'120px'}
                                     playing={video.isPlaying}
                                     controls={true}/>
                        <div className='absolute top-0 right-0'>
                          <DeleteForeverIcon onClick={() => handleModalDelete(video)}
                                             className='cursor-pointer opacity-0 group-hover/item:opacity-100'/>
                        </div>
                      </div>
                    )
                  }
                )
              }
            </div>
          </>
        }
        {!isOnlyImage &&
          <PreviewImageModal
            handleDeleteImage={handleDeleteImage}
            selectedImage={selectedImage}
            isOpen={isOpen.modalPreview}
            handleClose={handleClosePreview}
            handleChangeImage={handleChangeImage}
            uploadImage={uploadImage}
            isloading={isloading}
            setIsloading={setIsloading}
          />
        }
        <BaseDeleteModal
          label='この画像を削除してもよろしいですか？'
          isOpen={isOpen.modalDelete}
          handleClose={handleCloseDeleteModal}
          categoryName={img?.id}
          handleDelete={handleDelete}
        />
      </div>
      <div className={`${!isNotPage && 'hidden tablet:flex fixed right-0 top-0 pt-[64px] h-full'}`}>
        <SideBarRight folders={imageFolders} selectedFolder={selectedImageFolder}
                      setSelectedFolder={setSelectedImageFolder} setFolders={setImageFolders} folderType={'image'}
                      isNotPage={isNotPage}/>
      </div>
    </div>
  );
}

export default MainImage;
