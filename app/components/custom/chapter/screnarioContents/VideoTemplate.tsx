import React, {useEffect, useState} from 'react';
import TextField from "@mui/material/TextField";
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtomValue, useSetAtom} from 'jotai';
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {cloneDeep, isNil} from "lodash";
import {getYoutubeVideoIdFromUrl} from "@/app/common/getIdVideo";
import {BlockVideo, DataVideoValues} from "@/app/types/block";
import {VIDEO, VIMEO, YOUTUBE} from "@/app/configs/constants";
import {convertToHMS} from "@/app/common/convertToHMS";
import {convertToSeconds} from "@/app/common/convertToSeconds";
import {ErrorsVideo, VimeoChapter} from "@/app/types/types";
import {toast} from "react-toastify";
import {convertISO8601} from "@/app/common/convertISO8601";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {convertInputNumber} from "@/app/common/convertNumber";
import VideoYoutubePlayer from "@/app/components/custom/chapter/screnarioContents/VideoYoutubePlayer";
import VideoVimeoPlayer from "@/app/components/custom/chapter/screnarioContents/VideoVimeoPlayer";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import Modal from "@/app/components/custom/Modal";
import ReactPlayer from "react-player";
import {useVideo} from "@/app/hooks/useVideo";

type props = {
  onDelete: () => void
  onCopy: () => void
  id: string
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block: BlockVideo,
  handlePlay?: (player: any) => void;
}
// export const patternUrl = /^(https?:\/\/)?(www\.)?(player\.)?(vimeo\.com|youtube\.com)\/?/
export const patternYoutube = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
export const patternVimeo = /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/
const patternNumberOnly = /^[0-9\b]+$/;
const patternExtractedTimeYoutube = /&t=(\d+)/
const patternExtractedTimeVimeo = /[?&]ts=(\d+)|[#&]?t=(\d+)/g;
const patternReplaceTimeYoutube = /([&?]t=)\d+/;
const patternReplaceTimeVimeo = /([&?]ts=|#t=)\d+/;
const patternExtractedIdYoutube = /(?:\/|v=)([a-zA-Z0-9_-]{11})/;
const WIDTH = '100%'
const HEIGHT = '315'
const END_GREATER_WARNING = '終了時刻は開始フィールドに設定された時刻以上でなければなりません'
const END_LESSER_WARNING = '設定された終了時間が適用できません。再度設定してください'
const START_LESSER_WARNING = '開始時間は終了時間以下でなければなりません'
const initErrors: ErrorsVideo = {
  url: '',
  startHours: '',
  startMinutes: '',
  startSeconds: '',
  endHours: '',
  endMinutes: '',
  endSeconds: ''
}


function VideoTemplate({
                         block,
                         onDelete,
                         onCopy,
                         id,
                         isShowAddButton,
                         handleGetIndex,
                         handleMultiCopy,
                         handlePlay
                       }: props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  // const [helperText, setHelperText] = React.useState('');
  const [isPlay, setIsPlay] = React.useState(false);
  const [startHours, setStartHours] = React.useState<number>(() => Math.floor(block?.data?.startAt / 3600))
  const [startSeconds, setStartSeconds] = React.useState<number>(() => block?.data?.startAt % 3600 % 60)
  const [startMinutes, setStartMinutes] = React.useState<number>(() => Math.floor((block?.data?.startAt % 3600) / 60))
  const [endHours, setEndHours] = React.useState<number>(() => Math.floor(block?.data?.endAt / 3600))
  const [endSeconds, setEndSeconds] = React.useState<number>(() => block?.data?.endAt % 3600 % 60)
  const [endMinutes, setEndMinutes] = React.useState<number>(() => Math.floor((block?.data?.endAt % 3600) / 60))
  const [embedVimeoUri, setEmbedVimeoUri] = React.useState<string>('');
  const [vimeoId, setVimeoId] = React.useState<string>('');
  const [errors, setErrors] = React.useState<ErrorsVideo>(initErrors)
  const [duration, setDuration] = React.useState<number>(0)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)
  const chapterError = useAtomValue(chapterErrorAtom)
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [draftSelectedVideoUrl, setDraftSelectedVideoUrl] = useState<string>('')
  const [openSelectVideo, setOpenSelectVideo] = useState<boolean>(false)
  const {listAllVideos} = useVideo()


  useEffect(() => {
    (async () => {
      if (!block?.data?.url) return
      setVimeoId(block?.data?.url);
      const {_duration, _embedVimeoUri} = await getDurationAndEmbedVimeoUriFromURl(block.data.url)
      !isNil(_duration) && setDuration(_duration)
      !isNil(_embedVimeoUri) && setEmbedVimeoUri(_embedVimeoUri)
    })()
  }, [block?.type, block?.data?.url])

  useEffect(() => {
    setIsPlay(block?.data?.autoPlay || false)
  }, [block?.data?.autoPlay]);

  const getDurationAndEmbedVimeoUriFromURl = async (url: string) => {
    let _duration: number, _embedVimeoUri: string
    url = url.trim()
    if (block?.type === VIMEO) {
      const apiVimeoUrl = `https://vimeo.com/api/oembed.json?url=${url}`
      const res = await fetchEmbedVimeo(apiVimeoUrl)
      _embedVimeoUri = res.html.replace(/width="\d+"/, `width=${WIDTH}`)
        .replace(/height="\d+"/, `height=${HEIGHT}`)
      _duration = res.duration
    }
    if (block?.type === YOUTUBE) {
      const match = url.match(patternExtractedIdYoutube)
      const youtubeVideoId = match ? match[1] : ''
      const apiYoutubeUrl = youtubeVideoId ? `https://www.googleapis.com/youtube/v3/videos?id=${youtubeVideoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&part=contentDetails` : ''
      const res = await fetchEmbedVimeo(apiYoutubeUrl)
      if (res?.items?.length > 0) {
        const durationISO8601 = res.items[0]?.contentDetails?.duration ?? "";
        _duration = convertISO8601(durationISO8601)
      }
    }
    return {_duration, _embedVimeoUri}
  }

  const fetchEmbedVimeo = async (url) => {
    try {
      const res = await fetch(url)
      return res.json()
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const handleOnChangeUrl = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const url = e.target.value
    const _block = cloneDeep(block)
    _block.data.url = url
    checkVideoUrl(_block)
    updateBlocks(_block)
  };

  const newUrl = (url: string, newValue: number) => {
    if (block.type === VIMEO) {
      if (!url.includes('?ts=') && !url.includes('#t=')) {
        url += `#t=${newValue}`
        return url
      }
      return url.replace(patternReplaceTimeVimeo, `$1${url.includes('?ts=') ? newValue * 1000 : newValue}`) ?? ''
    }
    if (block.type === YOUTUBE) {
      if (!url.includes('&t=')) {
        url += `&t=${newValue}`
        return url
      }
      return url.replace(patternReplaceTimeYoutube, `$1${newValue}`) ?? ''
    }
    return ''
  }

  const checkVideoUrl = (block: BlockVideo) => {
    const regexYoutube = new RegExp(patternYoutube)
    const regexVimeo = new RegExp(patternVimeo)
    const url = block.data.url.trim()
    if (!regexYoutube.test(url) && block.type === YOUTUBE)
      return setErrors((prevErrors) => ({...prevErrors, url: 'Youtube のURLを入力してください'}));
    if (!regexVimeo.test(url) && block.type === VIMEO) {
      return setErrors((prevErrors) => ({...prevErrors, url: 'Vimeo のURLを入力してください'}));
    }
    setErrors((prevErrors) => ({...prevErrors, url: ''}));
    block.type === 'youtube' ? clearChapterError('youtubeUrl') : clearChapterError('vimeoUrl')
    setStartEndAtByUrl(block)
  }

  const setStartEndAtByUrl = async (block: BlockVideo) => {

    const url = block.data.url.trim()
    if (!url) return
    const {_duration} = await getDurationAndEmbedVimeoUriFromURl(url)

    let match
    if (block.type === YOUTUBE)
      match = Array.from(patternExtractedTimeYoutube.exec(url) ?? []);
    if (block.type === VIMEO)
      match = Array.from(url.matchAll(patternExtractedTimeVimeo) ?? []);
    let extractedTime = getExtractedTime(match)
    await setHMSByUrl(url, _duration, extractedTime, match)

    block.data.endAt = _duration
    block.data.startAt = extractedTime
    if (extractedTime > block.data.endAt) {
      block.data.startAt = 0
      toast.warning(START_LESSER_WARNING)
    }
  }

  const setHMSByUrl = async (url: string, duration: number, extractedTime: number, match: any[]) => {
    const {hours: endHours, minutes: endMinutes, seconds: endSeconds} = convertToHMS(duration)
    setEndHours(endHours)
    setEndMinutes(endMinutes)
    setEndSeconds(endSeconds)

    const {hours: startHours, minutes: startMinutes, seconds: startSeconds} = convertToHMS(extractedTime)
    if (match?.length <= 0 || !isValidStartEndTime(startHours, startMinutes, startSeconds, endHours, endMinutes, endSeconds)) {
      setStartHours(0)
      setStartMinutes(0)
      setStartSeconds(0)
      extractedTime = 0
      return
    }
    setStartHours(startHours)
    setStartMinutes(startMinutes)
    setStartSeconds(startSeconds)
  }

  const getExtractedTime = (match: any[]) => {
    let extractedTime = match?.[1] ? Number(match[1]) : 0;
    block.type === VIMEO && match.forEach(match => {
      if (match[1])
        extractedTime = Math.floor(match[1] / 1000) // "Value after ?ts="
      if (match[2])
        extractedTime = match?.[2] ? Number(match[2]) : 0 // "Value after #t="
    });
    return extractedTime
  }

  const handlePlayVideo = () => {
    setIsPlay(!isPlay)
    if (block) {
      updateFieldVideoBlocks('autoPlay', !isPlay)
    }
  }

  const isValidStartEndTime = (startHours: number, startMinutes: number, startSeconds: number, endHours: number, endMinutes: number, endSeconds: number) => {
    const startTotalSeconds = convertToSeconds(startHours, startMinutes, startSeconds)
    const endTotalSeconds = convertToSeconds(endHours, endMinutes, endSeconds)
    return startTotalSeconds <= endTotalSeconds
  }

  const isEndLessThanDurationTime = (endHours: number, endMinutes: number, endSeconds: number) => {
    const endTotalSeconds = convertToSeconds(endHours, endMinutes, endSeconds)
    return endTotalSeconds <= duration
  }

  const handleChangeStartHours = (e) => {
    const _block = cloneDeep(block)
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(Number(value), startMinutes, startSeconds, endHours, endMinutes, endSeconds)) {
      return toast.warning(START_LESSER_WARNING)
    }
    setStartHours(Number(value))
    const totalSeconds = convertToSeconds(Number(value), startMinutes, startSeconds)
    _block.data.url = newUrl(block.data.url, totalSeconds)
    _block.data[name] = totalSeconds
    updateBlocks(_block)
  }

  const handleChangeStartMinutes = (e) => {
    const _block = cloneDeep(block)
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(startHours, Number(value), startSeconds, endHours, endMinutes, endSeconds)) {
      return toast.warning(START_LESSER_WARNING)
    }
    setStartMinutes(Number(value))
    const totalSeconds = convertToSeconds(startHours, Number(value), startSeconds)
    _block.data.url = newUrl(block.data.url, totalSeconds)
    _block.data[name] = totalSeconds
    updateBlocks(_block)
  }

  const handleChangeStartSeconds = (e) => {
    const _block = cloneDeep(block)
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(startHours, startMinutes, Number(value), endHours, endMinutes, endSeconds)) {
      return toast.warning(START_LESSER_WARNING)
    }
    setStartSeconds(Number(value))
    const totalSeconds = convertToSeconds(startHours, startMinutes, Number(value))
    if (block?.type === VIMEO || block?.type === YOUTUBE) {
      _block.data.url = newUrl(block.data.url, totalSeconds)
    }
    _block.data[name] = totalSeconds
    updateBlocks(_block)
  }
  const handleChangeEndHours = (e) => {
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(startHours, startMinutes, startSeconds, Number(value), endMinutes, endSeconds)) {
      return toast.warning(END_GREATER_WARNING)
    }
    if (!isEndLessThanDurationTime(Number(value), endMinutes, endSeconds)) {
      return toast.warning(END_LESSER_WARNING)
    }
    setEndHours(Number(value))
    updateFieldVideoBlocks(name, convertToSeconds(Number(value), endMinutes, endSeconds))
  }

  const handleChangeEndMinutes = (e) => {
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(startHours, startMinutes, startSeconds, endHours, Number(value), endSeconds)) {
      return toast.warning(END_GREATER_WARNING)
    }
    if (!isEndLessThanDurationTime(endHours, Number(value), endSeconds)) {
      return toast.warning(END_LESSER_WARNING)
    }
    setEndMinutes(Number(value))
    updateFieldVideoBlocks(name, convertToSeconds(endHours, Number(value), endSeconds))
  }
  const handleChangeEndSeconds = (e) => {
    const name = e.target.name
    const value = e.target.value
    if (!isValidStartEndTime(startHours, startMinutes, startSeconds, endHours, endMinutes, Number(value))) {
      return toast.warning(END_GREATER_WARNING)
    }
    if (!isEndLessThanDurationTime(endHours, endMinutes, Number(value))) {
      return toast.warning(END_LESSER_WARNING)
    }
    setEndSeconds(Number(value))
    updateFieldVideoBlocks(name, convertToSeconds(endHours, endMinutes, Number(value)))
  }

  const handleChangeFullScreen = (e) => {
    const name = e.target.name
    const value = e.target.checked
    updateFieldVideoBlocks(name, value)
  }

  const updateFieldVideoBlocks = (name: string, value: DataVideoValues) => {
    const _block = cloneDeep(block)
    _block.data[name] = value
    updateBlocks(_block)
  }

  const handleUploadIVideo = async (event) => {
    setLoadingBtn(true)
    if (!event.target.files[0]) return
    const _block = cloneDeep(block)
    try {
      _block.data.url = await handleUploadFile(event.target.files[0], userInfo?.user_id, 'videos')
      updateBlocks(_block)
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingBtn(false)
    }
  }
  const handleSelectVideo = (video) => {
    setDraftSelectedVideoUrl(video?.url)
  }
  const onSubmitSelectVideo = () => {
    if (block?.type !== VIDEO) return;
    updateBlocks({...block, data: {...block.data, url: draftSelectedVideoUrl}})
    setOpenSelectVideo(false)
    setLoadingBtn(false)
  }
  const handleCloseSelectVideo = () => {
    if (block?.type !== VIDEO) return;
    setOpenSelectVideo(false)
    setLoadingBtn(false)
    setDraftSelectedVideoUrl('')
  }
  const handleMetadataLoaded = (event) => {
    if (block?.type !== VIDEO) return;
    const _duration = event.target.duration
    const duration = Math.round(_duration) > event.target.duration ? Math.round(_duration) - 1
      : Math.round(_duration)
    setDuration(duration)
    setEndHours(endHours ? endHours : duration >= 3600 ? Math.floor(duration / 3600) : 0)
    setEndMinutes(endMinutes ? endMinutes : duration >= 60 ? Math.floor(duration % 3600 / 60) : 0)
    setEndSeconds(endSeconds ? endSeconds : duration % 60)
    updateBlocks({...block, data: {...block.data, endAt: duration}})
  };

  return (
    <CardCustom
      onChangePlayVideo={handlePlayVideo}
      isPlay={isPlay}
      autoPlay={true}
      isCopy={true}
      onCopy={onCopy}
      block={block}
      onDelete={onDelete}
      title={block.type === YOUTUBE ? YOUTUBE : block.type === VIMEO ? VIMEO : VIDEO}
      color={'#FF0000'}
      isShowAddButton={isShowAddButton}
      handleMultiCopy={handleMultiCopy}
      handleGetIndex={handleGetIndex}
      className={' border-2 border-solid border-[#FF0000] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}
    >
      <div className={'text-xs flex flex-col'}>
        {
          block.type === YOUTUBE || block.type === VIMEO ?
            <TextField
              error={Boolean(errors.url) || (block.type === 'youtube' ? Boolean(chapterError?.youtubeUrl) : Boolean(chapterError.vimeoUrl))}
              id={id}
              onChange={handleOnChangeUrl}
              value={block?.data?.url ?? ''}
              helperText={errors.url || (block.type === 'youtube' ? chapterError.youtubeUrl : chapterError.vimeoUrl)}
              label="URL追加"
              variant="outlined"
              size={'small'}
              fullWidth={true}
              className={'my-4'}
            /> :
            <div className={'py-5'}>
              <LoadingButton
                className={'mb-2 mr-4'}
                variant={'outlined'}
                loading={loadingBtn}
                color="primary"
                aria-label="upload picture"
                component="label"
                endIcon={!block.data?.url ? <AddIcon/> : <></>}
              >
                {
                  block?.data?.url ? '動画変更' : '動画アップロード'
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
                loading={loadingBtn}
                color="primary"
                aria-label="upload picture"
                component="label"
                endIcon={!block?.data?.url ? <AddIcon/> : <></>}
                onClick={() => {
                  setDraftSelectedVideoUrl(block?.data?.url ?? '')
                  setOpenSelectVideo(true)
                }}
              >
                動画選択
              </LoadingButton>
            </div>
        }

      </div>
      <div className={'flex flex-col items-center gap-4'}>
        <div className={'flex flex-wrap gap-2 items-center ml-1'}>
          <p>Start:</p>
          <TextField name='startAt'
                     id="outlined-basic"
                     value={convertInputNumber(startHours)}
                     onChange={handleChangeStartHours}
                     variant="outlined" size={'small'}
                     label={'hours'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}
            // error={Boolean(errors.startHours)}
          />
          <TextField name='startAt'
                     id="outlined-basic"
                     onChange={handleChangeStartMinutes}
                     variant="outlined" size={'small'}
                     value={convertInputNumber(startMinutes)}
                     label={'minutes'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}
            // error={Boolean(errors.startMinutes)}

          />
          <TextField name='startAt'
                     id="outlined-basic"
                     onChange={handleChangeStartSeconds}
                     variant="outlined" size={'small'}
                     value={convertInputNumber(startSeconds)}
                     label={'seconds'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}
            // error={Boolean(errors.startSeconds)}
          />
        </div>
        <div className={'flex flex-wrap gap-2 items-center ml-1'}>
          <p>End :</p>
          <TextField name='endAt'
                     id="outlined-basic"
                     onChange={handleChangeEndHours}
                     variant="outlined" size={'small'}
                     value={convertInputNumber(endHours)}
                     label={'hours'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}
          />
          <TextField name='endAt'
                     id="outlined-basic"
                     onChange={handleChangeEndMinutes}
                     variant="outlined" size={'small'}
                     value={convertInputNumber(endMinutes)}
                     label={'minutes'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}

          />
          <TextField name='endAt'
                     id="outlined-basic"
                     onChange={handleChangeEndSeconds}
                     variant="outlined" size={'small'}
                     value={convertInputNumber(endSeconds)}
                     label={'seconds'}
                     className={'w-1/6'}
                     type={'number'}
                     inputProps={{min: 0}}
          />
          <FormControlLabel label={<Typography>FullScreen</Typography>} labelPlacement={'start'}
                            control={<Checkbox name='isFullScreen' checked={block?.data?.isFullScreen}
                                               onChange={handleChangeFullScreen}/>}

          />
        </div>
      </div>
      <div className={'m-auto pb-5 mt-4'}>
        {
          new RegExp(patternYoutube).test(block?.data?.url?.trim()) && block.type === YOUTUBE &&
          <VideoYoutubePlayer videoId={getYoutubeVideoIdFromUrl(block?.data?.url)} onPlay={handlePlay}/>
        }
        {
          new RegExp(patternVimeo).test(block?.data?.url?.trim()) && block.type === VIMEO &&
          <VideoVimeoPlayer videoId={vimeoId} onPlay={handlePlay}/>
        }
        {
          block.type === VIDEO &&
          <ReactPlayer url={block?.data?.url ?? ''}
                       width={'100%'}
                       height={'fit-content'}
                       controls={true}
                       playing={false}
                       onReady={handlePlay}
                       onDuration={(duration) => setDuration(duration)}
                       onLoadedMetadata={handleMetadataLoaded}
          />
        }
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
              listAllVideos?.map((video) => {
                return (
                  <div key={video.id}
                       className={`relative group/item my-1 bg-black ${draftSelectedVideoUrl === video?.url ? 'border-solid border-2 border-red-400 p-1 pb-0 rounded-md' : 'p-1 pb-0'}`}
                       onClick={() => handleSelectVideo(video)}>
                    <ReactPlayer url={video?.url ?? ''}
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
    </CardCustom>
  );
}

export default VideoTemplate;
