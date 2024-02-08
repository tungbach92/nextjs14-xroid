import React, {useEffect, useRef, useState} from 'react';
import {VimeoChapter} from "@/app/types/types";
import Modal from "@/app/components/custom/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import StartEndVideoTextField from "@/app/components/Content/custom/StartEndVideoTextField";
import {handleChangeTime} from "@/app/common/onChangeTimeYoutubeChapter";
import {getId} from "@/app/common/getId";
import {createExtraChapter, updateExtraChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadOnlyImage from "@/app/components/custom/UploadOnlyImage";
import {CssTextField} from "@/app/components/custom/CssTextField";
import ReactPlayer from "react-player";
import {useVideo} from "@/app/hooks/useVideo";


type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  maxIndex?: number
  contentId: string
  extraChapter?: VimeoChapter
}
const initialChapterState = {
  url: '',
  contentId: '',
  title: '',
  description: '',
  thumbnail: '',
  duration: 0,
  extraChapterType: 'video',
  isSettingCube: false,
  timeStartEnd: {
    startHour: 0,
    startMinute: 0,
    startSecond: 0,
    endHour: 0,
    endMinute: 0,
    endSecond: 0,
  }
}

function VideoChapter({open, setOpen, maxIndex, contentId, extraChapter}: Props) {
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [videoData, setVideoData] = useState<VimeoChapter>({...initialChapterState});
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const playerRef = useRef(null);
  const [openSelectVideo, setOpenSelectVideo] = useState<boolean>(false)
  const [draftSelectedVideo, setDraftSelectedVideo] = useState<VimeoChapter>({})
  const {listAllVideos} = useVideo()

  useEffect(() => {
    if (!extraChapter) return;
    setVideoData(extraChapter)
  }, [extraChapter]);


  const handleUploadIVideo = async (event) => {
    setLoadingBtn(true)
    if (!event.target.files[0]) return
    try {
      const url = await handleUploadFile(event.target.files[0], userInfo?.user_id, 'videos')
      setVideoData({...videoData, url: url})
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingBtn(false)
    }
  }
  const handleMetadataLoaded = (event) => {
    const _duration = event.target.duration
    const duration = Math.round(_duration) > event.target.duration ? Math.round(_duration) - 1
      : Math.round(_duration)
    const endHour = videoData?.timeStartEnd?.endHour
    const endMinute = videoData?.timeStartEnd?.endMinute
    const endSecond = videoData?.timeStartEnd?.endSecond
    setVideoData({
      ...videoData,
      duration: duration,
      timeStartEnd: {
        startHour: videoData?.timeStartEnd?.startHour || 0,
        startMinute: videoData?.timeStartEnd?.startMinute || 0,
        startSecond: videoData?.timeStartEnd?.startSecond || 0,
        endHour: endHour ? endHour : duration >= 3600 ? Math.floor(duration / 3600) : 0,
        endMinute: endMinute ? endMinute : duration >= 60 ? Math.floor((duration % 3600) / 60) : 0,
        endSecond: endSecond ? endSecond : duration >= 60 ? Math.floor(duration % 60) : duration || 0,
      }
    })
  };

  const onSubmit = async () => {
    if (!videoData?.url) return toast.error('動画をアップロードしてください。', {autoClose: 3000})
    if(!videoData?.title) return toast.error('タイトルを入力してください。', {autoClose: 3000})
    const data = {
      ...videoData,
      id: getId('chapter_', 8),
      contentId,
      chapterIndex: videoData?.chapterIndex ?? maxIndex + 1,
      url: videoData?.url,
      duration: videoData?.duration,
      description: videoData?.description,
      thumbnail: videoData?.thumbnail,
      extraChapterType: 'video',
      timeStartEnd: {
        startHour: videoData?.timeStartEnd?.startHour,
        startMinute: videoData?.timeStartEnd?.startMinute,
        startSecond: videoData?.timeStartEnd?.startSecond,
        endHour: videoData?.timeStartEnd?.endHour,
        endMinute: videoData?.timeStartEnd?.endMinute,
        endSecond: videoData?.timeStartEnd?.endSecond,
      },
      title: videoData?.title,
      isSettingCube: videoData?.isSettingCube
    }
    const updateChapterData = {
      ...videoData,
      id: extraChapter?.id,
    }
    try {
      if (extraChapter?.id) {
        await updateExtraChapter(updateChapterData)
        toast.success('更新に成功しました。', {autoClose: 3000})
      } else {
        await createExtraChapter(data)
        toast.success('作成に成功しました。', {autoClose: 3000})
      }
    } catch (e) {
      toast.error('保存できません。', {autoClose: 3000})
      console.log(e);
    } finally {
      setOpen(false)
      setVideoData({...initialChapterState})
    }
  }
  const onCheck = () => {
    setVideoData({...videoData, isSettingCube: !videoData?.isSettingCube})
  }
  const onClose = () => {
    setOpen(false)
    setVideoData({...initialChapterState})
  }

  const onChangeDescription = (e) => {
    const value = e.target.value;
    setVideoData({...videoData, description: value, title: value})
  }

  const onUploadThumbnail = (image: string) => {
    setVideoData({...videoData, thumbnail: image})
  }
  const handleSelectVideo = (video: VimeoChapter) => {
    setDraftSelectedVideo(video)
  }

  const onSubmitSelectVideo = () => {
    setVideoData({...videoData, url: draftSelectedVideo?.url})
    setOpenSelectVideo(false)
    setLoadingBtn(false)
  }
  const handleCloseSelectVideo = () => {
    setOpenSelectVideo(false)
    setDraftSelectedVideo({})
    setLoadingBtn(false)
  }

  return (
    <div>
      <Modal size={'sm'}
             actionPosition={'center'}
             dividers={false}
             btnCancel={''}
             btnSubmit={'保存'}
             title={
               <div className={'flex gap-2 text-xl'}>
                 <img
                   src={'/icons/content/black_video_icon.svg'}
                   alt={'yt'}/>
                 動画
               </div>}
             open={open}
             onSubmit={() => onSubmit()}
             setOpen={setOpen}
             handleClose={onClose}
      >
        <div className={'w-[90%] mx-auto'}>
          <LoadingButton
            className={'mb-2 mr-4'}
            variant={'outlined'}
            loading={loadingBtn}
            color="primary"
            aria-label="upload picture"
            component="label"
            endIcon={!videoData.url ? <AddIcon/> : <></>}
          >
            {
              videoData?.url ? '動画変更' : '動画アップロード'
            }
            <input
              id={`upload-image`}
              hidden
              accept="video/*"
              type="file"
              onChange={event => handleUploadIVideo(event)}
            />
          </LoadingButton>
          <LoadingButton
            className={'mb-2'}
            variant={'outlined'}
            disabled={loadingBtn}
            color="primary"
            aria-label="upload picture"
            component="label"
            endIcon={!videoData.url ? <AddIcon/> : <></>}
            onClick={() => {
              setDraftSelectedVideo(videoData || {})
              setOpenSelectVideo(true)
            }}
          >
            動画選択
          </LoadingButton>
          <div className={'flex items-center gap-[1px] border border-solid border-gray-300 p-1 rounded relative'}>
            <UploadOnlyImage
              iconSize={30}
              uploadOrSelectClassName={'flex mx-4'}
              imageHeight={83}
              imageWidth={83}
              image={videoData?.thumbnail}
              onChangeData={(image) => onUploadThumbnail(image)}/>
            <img src={'/icons/content/black_video_icon.svg'} alt={'video'}
                 className={'absolute bottom-1 right-1 pl-2'}/>
            <div className={'w-full'}>
              <CssTextField
                sx={{"& fieldset": {border: 'none'}}}
                rows={3}
                value={videoData ? videoData?.title : '動画のタイトル入力。'}
                placeholder={'動画のタイトル入力。'}
                onChange={(e) => onChangeDescription(e)}
                size={'small'}
                multiline={true}
                variant="outlined"
                className={'w-full'}
              />
            </div>
          </div>
          <StartEndVideoTextField
            className={'mt-5 mb-2'}
            hours={videoData?.timeStartEnd?.startHour || 0}
            minutes={videoData?.timeStartEnd?.startMinute || 0}
            seconds={videoData?.timeStartEnd?.startSecond || 0}
            handleChangeTime={(e, type) => handleChangeTime(e, type, videoData, setVideoData)}
            title={'Start'}/>

          <StartEndVideoTextField
            className={'mb-2'}
            hours={videoData?.timeStartEnd?.endHour || 0}
            minutes={videoData?.timeStartEnd?.endMinute || 0}
            seconds={videoData?.timeStartEnd?.endSecond || 0}
            handleChangeTime={(e, type) => handleChangeTime(e, type, videoData, setVideoData)}
            title={'End'}/>
          {
            videoData?.url ?
              <ReactPlayer
                url={videoData?.url}
                width={'100%'}
                height={'100%'}
                ref={playerRef}
                controls={true}
                onLoadedMetadata={handleMetadataLoaded}
              /> :
              <video width={'100%'} height={'100%'} controls={true}>
                <source/>
              </video>
          }

          <FormControlLabel control={<Checkbox checked={!!videoData?.isSettingCube}
                                               onChange={(e) => onCheck()}/>}
                            label="課金設定を適用" className={'text-black'}/>
        </div>
        {
          <Modal open={openSelectVideo}
                 setOpen={setOpenSelectVideo}
                 title={'動画選択'} size={'sm'}
                 actionPosition={'center'}
                 btnSubmit={'選択'}
                 btnCancel={''}
                 onSubmit={() => onSubmitSelectVideo()}
                 handleClose={() => handleCloseSelectVideo()}
          >
            <div className={'flex flex-wrap mx-4 items-end justify-between'}>
              {
                listAllVideos?.map((video: VimeoChapter) => {
                  return (
                    <div key={video.id}
                         className={`relative group/item bg-black my-1 ${draftSelectedVideo?.url === video?.url ? 'border-solid border-2 border-red-400 p-1 pb-0 rounded-md' : 'p-1 pb-0'}`}
                         onClick={() => handleSelectVideo(video)}>
                      <ReactPlayer url={video.url}
                                   width={'250px'}
                                   height={'150px'}
                                   controls={true}/>
                    </div>
                  )
                })
              }
            </div>
          </Modal>
        }
      </Modal>
    </div>
  );
}

export default VideoChapter;
