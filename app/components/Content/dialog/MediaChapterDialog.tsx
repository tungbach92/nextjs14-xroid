import React, {useEffect, useState} from 'react';
import Modal from "@/app/components/custom/Modal";
import {CssTextField} from "@/app/components/custom/CssTextField";
import StartEndVideoTextField from "@/app/components/Content/custom/StartEndVideoTextField";
import {VimeoChapter, YoutubeChapter} from "@/app/types/types";
import {toast} from "react-toastify";
import AddContentImage from "@/app/components/Content/AddContentImage";
import VideoVimeoPlayer from "@/app/components/custom/chapter/screnarioContents/VideoVimeoPlayer";
import {patternVimeo, patternYoutube} from "@/app/components/custom/chapter/screnarioContents/VideoTemplate";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {getYoutubeVideoIdFromUrl} from "@/app/common/getIdVideo";
import UploadOnlyImage from "@/app/components/custom/UploadOnlyImage";
import {getId} from "@/app/common/getId";
import {createExtraChapter, updateExtraChapter} from "@/app/common/commonApis/chaptersApi";
import {handleChangeTime} from "@/app/common/onChangeTimeYoutubeChapter";
import {fetchMetadata} from "@/app/common/fetchMetaData";


type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  type?: string
  maxIndex?: number
  contentId: string
  extraChapter?: YoutubeChapter | VimeoChapter
}


function MediaChapterDialog({open, setOpen, type, maxIndex, contentId, extraChapter}: Props) {
  const isVimeo = type === 'vimeo'
  const isVideo = type === 'video'
  const [metadata, setMetadata] = useState<YoutubeChapter | VimeoChapter>({});
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [draftUrl, setDraftUrl] = useState<string>('')
  const _metadata = {...metadata} as VimeoChapter


  useEffect(() => {
    setDraftUrl(extraChapter?.url)
  }, [])

  useEffect(() => {
    const data = {
      duration: extraChapter?.duration,
      url: extraChapter?.url,
      description: extraChapter?.description,
      thumbnail: extraChapter?.thumbnail,
      timeStartEnd: extraChapter?.timeStartEnd,
      title: extraChapter?.title
    }
    if (extraChapter?.url) {
      if ('isSettingCube' in extraChapter) {
        setMetadata({
          ...metadata,
          ...data,
          isSettingCube: extraChapter?.isSettingCube
        })
      } else {
        setMetadata({
          ...metadata,
          ...data
        })
      }
    }
  }, [extraChapter])

  useEffect(() => {
    if (metadata.timeStartEnd?.startMinute > 59) {
      setMetadata({
        ...metadata,
        timeStartEnd: {
          ...metadata?.timeStartEnd,
          startHour: metadata?.timeStartEnd?.startHour + Math.floor(metadata.timeStartEnd?.startMinute / 60),
          startMinute: metadata.timeStartEnd?.startMinute % 60
        }
      })
    }
  }, [metadata.timeStartEnd?.startMinute]) //auto change hour when minute > 59

  useEffect(() => {
    if (metadata.timeStartEnd?.endMinute > 59) {
      setMetadata({
        ...metadata,
        timeStartEnd: {
          ...metadata?.timeStartEnd,
          endHour: metadata?.timeStartEnd?.endHour + Math.floor(metadata.timeStartEnd?.endMinute / 60),
          endMinute: metadata.timeStartEnd?.endMinute % 60
        }
      })
    }
  }, [metadata.timeStartEnd?.endMinute]) //auto change hour when minute > 59

  useEffect(() => {
    if (!metadata?.url) return
    fetchMetadata(isVimeo, metadata, setMetadata, extraChapter)
  }, [metadata?.url, isVimeo]);

  const onClose = () => {
    setDraftUrl('')
    setMetadata({})
    setOpen(false)
  }

  const onChangeDescription = (e) => {
    const value = e.target.value;
    setMetadata({...metadata, title: value})
  }

  const onUploadThumbnail = (image: string) => {
    setMetadata({...metadata, thumbnail: image})
  }
  const onSavedThumbnail = () => {
    setMetadata({...metadata, thumbnail: previewUrl})
    setOpenUploadDialog(false)
    setPreviewUrl('')
  }
  const onCanceledThumbnail = () => {
    setOpenUploadDialog(false)
    setPreviewUrl('')
  }
  const onChangeUrl = (e) => {
    const value = e.target.value;
    setDraftUrl(value)
  }
  const onblurUrl = (e) => {
    const value = e.target.value;
    if (!value) return
    if (!isVimeo && !new RegExp(patternYoutube).test(value)) {
      toast.error('YoutubeのURLを入力してください。', {autoClose: 3000})
      return
    }
    if (isVimeo && !new RegExp(patternVimeo).test(value)) {
      toast.error('VimeoのURLを入力してください。', {autoClose: 3000})
      return
    }
    setMetadata({...metadata, url: value})
  }
  const onCheck = () => {
    if (isVimeo) {
      setMetadata({..._metadata, isSettingCube: !_metadata?.isSettingCube})
    }
  }


  const onSubmit = async () => {
    const theSameData = {
      ...metadata,
      id: getId('chapter_', 8),
      contentId,
      chapterIndex: metadata?.chapterIndex ?? maxIndex + 1,
      url: metadata?.url,
      duration: metadata?.duration,
      description: metadata?.description,
      thumbnail: metadata?.thumbnail,
      extraChapterType: isVimeo ? 'vimeo' : isVideo ? 'video' : 'youtube',
      timeStartEnd: {
        startHour: metadata?.timeStartEnd?.startHour,
        startMinute: metadata?.timeStartEnd?.startMinute,
        startSecond: metadata?.timeStartEnd?.startSecond,
        endHour: metadata?.timeStartEnd?.endHour,
        endMinute: metadata?.timeStartEnd?.endMinute,
        endSecond: metadata?.timeStartEnd?.endSecond,
      },
      title: metadata?.title
    }
    const VimeoChapterData = {
      ...theSameData,
      isSettingCube: _metadata?.isSettingCube
    }
    const chapterData = isVimeo ? VimeoChapterData : theSameData

    if (!chapterData?.url) {
      toast.error('URLを入力してください。', {autoClose: 3000})
      return
    }
    if (!isVimeo && !new RegExp(patternYoutube).test(chapterData?.url?.trim())) {
      toast.error('YoutubeのURLを入力してください。', {autoClose: 3000})
      return
    }
    if (isVimeo && !new RegExp(patternVimeo).test(chapterData?.url?.trim())) {
      toast.error('VimeoのURLを入力してください。', {autoClose: 3000})
      return
    }
    const updateChapterData = {
      ...chapterData,
      id: extraChapter?.id,
    }
    try {
      if (extraChapter?.id) {
        await updateExtraChapter(updateChapterData)
        toast.success('更新に成功しました。', {autoClose: 3000})
      } else {
        await createExtraChapter(chapterData)
        toast.success('作成に成功しました。', {autoClose: 3000})
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false)
      setMetadata({})
    }
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
                   src={isVimeo ? '/icons/content/vimeo.svg' : isVideo ? '/icons/content/black_video_icon.svg' : '/icons/content/youtube.svg'}
                   alt={'yt'}/>
                 {isVimeo ? 'Vimeo' : isVideo ? '動画' : 'Youtube'}
               </div>}
             open={open}
             onSubmit={() => onSubmit()}
             setOpen={setOpen}
             handleClose={onClose}
      >
        <div className={'w-[90%] mx-auto'}>
          <CssTextField
            onBlur={(e) => onblurUrl(e)}
            className={'mb-2'}
            onChange={(e) => onChangeUrl(e)}
            value={draftUrl}
            size={'small'}
            fullWidth
            placeholder={isVimeo ? 'VimeoのURLを入力してください。' : 'YoutubeのURLを入力してください。'}
            variant="outlined"
          />
          {
            (new RegExp(patternYoutube).test(metadata?.url?.trim()) || new RegExp(patternVimeo).test(metadata?.url?.trim())) &&
            <div className={'flex flex-col'}>
              <div className={'flex items-center gap-[1px] border border-solid border-gray-300 p-1 rounded relative'}>
                <UploadOnlyImage
                  iconSize={30}
                  uploadOrSelectClassName={'flex mx-4'}
                  imageHeight={83}
                  imageWidth={83}
                  image={metadata?.thumbnail}
                  onChangeData={(image) => onUploadThumbnail(image)}/>
                <img src={isVimeo ? '/icons/content/vimeo.svg' : '/icons/content/youtube.svg'} alt={'yt'}
                     className={'absolute bottom-1 right-1 pl-2'}/>
                <div className={'w-full'}>
                  <CssTextField
                    sx={{"& fieldset": {border: 'none'}}}
                    rows={3}
                    value={metadata ? metadata?.title : 'このリンクはタイトルがありません。'}
                    onChange={(e) => onChangeDescription(e)}
                    size={'small'}
                    multiline={true}
                    variant="outlined"
                    className={'w-[93%]'}
                  />
                </div>
              </div>
              <StartEndVideoTextField
                className={'mt-5 mb-2'}
                hours={metadata?.timeStartEnd?.startHour}
                minutes={metadata?.timeStartEnd?.startMinute}
                seconds={metadata?.timeStartEnd?.startSecond}
                handleChangeTime={(e, type) => handleChangeTime(e, type, metadata, setMetadata)}
                title={'Start'}/>

              <StartEndVideoTextField
                className={'mb-2'}
                hours={metadata?.timeStartEnd?.endHour}
                minutes={metadata?.timeStartEnd?.endMinute}
                seconds={metadata?.timeStartEnd?.endSecond}
                handleChangeTime={(e, type) => handleChangeTime(e, type, metadata, setMetadata)}
                title={'End'}/>
              {!isVimeo && new RegExp(patternYoutube).test(metadata?.url?.trim()) &&
                <iframe width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${getYoutubeVideoIdFromUrl(metadata?.url)}?start=${metadata?.timeStartEnd?.startHour * 3600 + metadata?.timeStartEnd?.startMinute * 60 + metadata?.timeStartEnd?.startSecond}&end=${metadata?.timeStartEnd?.endHour * 3600 + metadata?.timeStartEnd?.endMinute * 60 + metadata?.timeStartEnd?.endSecond}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen/>

              }
              {
                isVimeo && new RegExp(patternVimeo).test(metadata?.url?.trim()) &&
                <VideoVimeoPlayer videoId={metadata?.url}/>}
              {
                isVimeo && <FormControlLabel control={<Checkbox checked={!!_metadata?.isSettingCube}
                                                                onChange={(e) => onCheck()}/>}
                                             label="課金設定を適用" className={'text-black'}/>
              }
            </div>
          }
        </div>
      </Modal>
      {
        openUploadDialog &&
        <Modal open={openUploadDialog}
               setOpen={setOpenUploadDialog}
               title={'サムネイル変更'}
               actionPosition={'center'}
               size={'sm'}
               btnSubmit={'保存'}
               dividers={false}
               onSubmit={() => onSavedThumbnail()}
               handleClose={() => onCanceledThumbnail()}
        >
          <AddContentImage
            className={'w-auto h-[180px]'}
            isNoResponse={true}
            previewUrl={previewUrl}
            setPreviewUrl={(value) => {
              setPreviewUrl(value)
            }}
          />
        </Modal>
      }
    </div>
  );
}

export default MediaChapterDialog;
