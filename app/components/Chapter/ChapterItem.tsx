import React, {useEffect, useMemo, useState} from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {PurchaseSetting} from "@/app/common/chapterPurchaseSetting";
import {copyDataChapter, deleteDataChapter, moveChapter, updateDataChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {Chapter, LinkAndSlideChapter, VimeoChapter, YoutubeChapter} from "@/app/types/types";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useContents} from "@/app/hooks/useContents";
import MoveChapterDialog from "@/app/components/Chapter/moveChapter/MoveChapterDialog";
import {Chip} from "@mui/material";
import LinkChapterDialog from "@/app/components/Content/dialog/LinkChapterDialog";
import MediaChapterDialog from "@/app/components/Content/dialog/MediaChapterDialog";
import VideoChapter from "@/app/components/Content/dialog/VideoChapter";

type Props = {
  chapter: Chapter
  contentId?: string,
  image?: string,
  name?: string,
  ticket?: boolean,
  banner?: boolean
  date?: string
  inContent?: boolean
  onUpdateBanner?: () => void
  handleDelete?: () => void
  cube?: number
  purchaseSetting: PurchaseSetting
  onchangeCube?: () => void
  hiddenAction?: boolean
  isExtraChapter?: boolean
  extraChapter?: YoutubeChapter | VimeoChapter | LinkAndSlideChapter
}

function ChapterItem({
                       image,
                       contentId,
                       name,
                       ticket,
                       banner,
                       date,
                       inContent,
                       handleDelete,
                       onUpdateBanner,
                       cube,
                       purchaseSetting,
                       chapter,
                       onchangeCube,
                       hiddenAction = false,
                       isExtraChapter = false,
                       extraChapter
                     }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const {contents, loadingContentsData} = useContents()
  const router = useRouter()
  const content = contents?.find((item) => item.id === contentId)
  const [chapterIndex, setChapterIndex] = useState<number>(null);
  const [openExtraChapter, setOpenExtraChapter] = useState<boolean>(false)
  const [openLinkOrSlide, setOpenLinkOrSlide] = useState<boolean>(false)
  const [openVideo, setOpenVideo] = useState<boolean>(false)
  const _extraMediaChapter = extraChapter as VimeoChapter
  const _extraLinkChapter = extraChapter as LinkAndSlideChapter


  useEffect(() => {
    if (!chapter?.isShowBanner) {
      setIsHidden(chapter?.isShowBanner)
      return;
    }
    setIsHidden(true)
  }, [chapter?.isShowBanner])

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOpenUpdateExtraChapter = () => {
    if (extraChapter?.extraChapterType === 'link') {
      setOpenLinkOrSlide(true)
      return;
    }
    if (extraChapter?.extraChapterType === 'slide') {
      setOpenLinkOrSlide(true)
      return;
    }
    if (extraChapter?.extraChapterType === 'youtube') {
      setOpenExtraChapter(true)
      return;
    }
    if (extraChapter?.extraChapterType === 'video') {
      setOpenVideo(true)
      return;
    }
  }

  const onUpdateChapter = (event, chapterId, folderId = '') => {
    if (isExtraChapter && ['youtube', 'vimeo'].includes(extraChapter?.extraChapterType)) {
      setOpenExtraChapter(true)
      return;
    }
    if (isExtraChapter && extraChapter?.extraChapterType === 'video') {
      setOpenVideo(true)
      return;
    }
    if (isExtraChapter && ['link', 'slide'].includes(extraChapter?.extraChapterType)) {
      setOpenLinkOrSlide(true)
      return;
    }
    event.preventDefault();
    let path = ''
    if (folderId) {
      path = `/contents/subFolder/${folderId}/subContent/${contentId}/${chapterId}`
    } else {
      path = `/contents/${contentId}/${chapterId}`
    }
    if (event.metaKey || event.ctrlKey) {
      return window.open(path, "_blank")
    } else {
      return router.push(path)
    }
  }

  const onChangeChapterIndex = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setChapterIndex(Number(event.target.value))
  }
  const onDeleteChapter = async () => {
    try {
      await deleteDataChapter(chapter?.id)
      toast.success('チャプターを削除しました', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error('チャプターを削除できませんでした', {autoClose: 3000})
    } finally {
      setAnchorEl(null)
    }
  }

  const handleShowHiddenBanner = async () => {
    if (!chapter) return;
    try {
      setLoading(true)
      const data = {
        ...chapter,
        isShowBanner: !chapter?.isShowBanner,
        isBanner: true
      }
      await updateDataChapter(data)
    } catch (e) {
      console.log(e)
      toast.error('チャプターを更新できませんでした')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyChapter = async () => {
    try {
      await copyDataChapter(contentId, chapter?.id)
      toast.success('チャプターをコピーしました。', {autoClose: 3000})
    } catch (e) {
      console.log(e);
      toast.error('チャプターをコピーできませんでした。', {autoClose: 3000})
    } finally {
      setAnchorEl(null)
    }
  }
  const handleMoverChapter = async (selectedContent) => {
    const data = {
      chapterId: chapter?.id,
      oldContentId: contentId,
      newContentId: selectedContent?.id,
      chapterIndex: chapterIndex || 1
    }
    if (!chapterIndex) return toast.error('チャプターの位置を入力してください。', {autoClose: 3000})
    if (!selectedContent?.id) return toast.error('コンテンツを選択してください。', {autoClose: 3000})
    try {
      setLoading(true)
      await moveChapter(data)
      toast.success('チャプターを移動しました。', {autoClose: 3000})
    } catch (e) {
      console.log(e);
      toast.error('チャプターを移動できませんでした。', {autoClose: 3000})
    } finally {
      setAnchorEl(null)
      setLoading(false)
    }
  }
  const extraChapterImage = useMemo(() => {
    if (extraChapter?.extraChapterType === 'youtube') return '/icons/content/youtube.svg'
    if (extraChapter?.extraChapterType === 'vimeo') return '/icons/content/vimeo.svg'
    if (extraChapter?.extraChapterType === 'link') return '/icons/bg-link.svg'
    if (extraChapter?.extraChapterType === 'slide') return '/icons/content/slide.svg'
    if (extraChapter?.extraChapterType === 'video') return '/icons/content/black_video_icon.svg'
    return ''
  }, [extraChapter.extraChapterType])

  const purchasePreview = useMemo(() => {
    const checkSttExtraChapter = extraChapter?.extraChapterType === 'youtube' ||
      (isExtraChapter && !_extraMediaChapter.isSettingCube) || (isExtraChapter && !_extraLinkChapter.isSettingCube)
    if (purchaseSetting?.changed === true) {
      if(checkSttExtraChapter) return null
      if (purchaseSetting?.listChanged.includes(chapter.id) && cube) return {
        src: '/icons/content/billingType.svg',
        value: cube
      }
    } else {
      if (cube) return {
        src: '/icons/content/billingType.svg',
        value: cube
      }
    }
    if (purchaseSetting) {
      if(checkSttExtraChapter) return null
      if (purchaseSetting.waitForFree) return {
        src: '/icons/content/waitForFree.svg'
      }
      if (purchaseSetting.purchaseRequired) {
        if(checkSttExtraChapter) return null
        return {
          src: '/icons/content/billingType.svg',
          value: purchaseSetting.energyCube
        }
      }
      if (!purchaseSetting.purchaseRequired)
        if (checkSttExtraChapter) return null
      return {
        src: '/icons/ticket-icon.svg',
        value: null
      }

    }
    return null
  }, [cube, purchaseSetting, extraChapter?.extraChapterType, _extraMediaChapter.isSettingCube, _extraLinkChapter.isSettingCube])

  let path = window.location.pathname.split('/')
  let findFolderId = path.find((e) => e.includes('folder_'))
  let folderId = ''
  if (findFolderId) folderId = findFolderId

  if (banner)
    return <div className={'relative'}>
      {
        ticket && isHidden &&
        <div className={'bg-[#E0E0E0] h-4 w-6 rounded flex m-auto justify-items-center absolute right-3 top-0'}>
          <MoreHorizIcon className={'-mt-1 cursor-pointer'} onMouseOver={handleOpen}/>
          <MoveChapterDialog chapter={chapter}
                             handleClose={handleClose}
                             handleCopyChapter={handleCopyChapter}
                             onUpdateBanner={onUpdateBanner}
                             folderId={folderId}
                             handleDelete={handleDelete}
                             content={content}
                             setAnchorEl={setAnchorEl}
                             onDeleteChapter={onDeleteChapter}
                             anchorEl={anchorEl}
                             handleMoverChapter={(selectedContent) => handleMoverChapter(selectedContent)}
                             isChapter={false}
                             loading={loading}
                             setChapterIndex={setChapterIndex}
                             chapterIndex={chapterIndex}
                             onChangeChapterIndex={onChangeChapterIndex}
          />
        </div>
      }
      <div>
        <img
          className={`w-full aspect-[1080/200] object-cover px-3 rounded-md cursor-pointer ${isHidden ? '' : 'opacity-40'}`}
          src={image}
          alt='checkout-icon'
          onClick={onUpdateBanner}
        />
        {loading && <CircularProgress size={30} className={'absolute top-[30px] right-[11px]'} color="inherit"/>}
      </div>

      {
        isHidden ?
          <div className="absolute top-[30px] right-[12px]">
            <VisibilityIcon aria-disabled={loading} className={'text-[#E0E0E0] text-[28px]'}
                            onClick={handleShowHiddenBanner}
                            fontSize="inherit"/>
          </div>
          :
          <div className={'absolute top-[30px] right-[12px]'}>
            <VisibilityOffIcon aria-disabled={loading} className={'text-[#E0E0E0] text-[28px]'}
                               onClick={handleShowHiddenBanner}
                               fontSize="inherit"/>
          </div>
      }
    </div>

  return (
    <div className={'flex px-3 justify-items-center items-center relative'}>
      {
        !hiddenAction && ticket &&
        <div className={'bg-[#E0E0E0] h-4 w-6 rounded flex m-auto justify-items-center absolute right-3 top-0 z-20'}>
          <MoreHorizIcon className={'m-auto -mt-1 cursor-pointer'} onMouseOver={handleOpen}/>
        </div>
      }
      <div className='bg-[#F5F7FB] w-full text-black cursor-pointer z-10 aspect-[1080/200]'>
        <a
          onClick={(event) => onUpdateChapter(event, chapter?.id, folderId)}
        >
          <div className='flex gap-2 items-center justify-between w-full aspect-[1080/200]'>
            <div className="flex flex-1 flex-row items-center gap-2 w-full max-w-[62%]">
              <img
                className={image === '/icons/no-image-frees.png' ? 'object-contain rounded-md' : 'object-cover rounded-md'}
                src={image}
                alt='chapter-image'
                height={'100%'}
                width={'50px'}
              />
              <div className={'flex flex-col gap-1 pb-[1px] w-full'}>
                <span className={`w-full text-[14px] font-medium truncate`}>{name}</span>
                {
                  chapter?.chapterType === 'createURoid' &&
                  <Chip label="Uroid" color="error" variant={'outlined'} size={'small'}
                        className={'max-w-fit text-black bg-pink-200'}/>
                }
                {extraChapterImage &&
                  <img src={extraChapterImage} alt="extra"
                       className={`${extraChapterImage === '/icons/content/slide.svg' ? 'w-5' : 'w-6'}`}/>
                }
              </div>
            </div>
            <div className={'flex cursor-pointer pt-1'}>
              {
                purchasePreview &&
                <div className={'flex items-center justify-center gap-0.5'} onClick={e => {
                  e.stopPropagation()
                  e.preventDefault();
                  onchangeCube?.()
                }}>
                  {
                    purchasePreview?.src &&
                    <img className='w-[25px]'
                         src={purchasePreview.src} alt='ticket-icon'/>
                  }
                  <div>{purchasePreview.value}</div>
                </div>
              }
            </div>
          </div>
        </a>
        <MoveChapterDialog chapter={chapter}
                           handleClose={handleClose}
                           handleCopyChapter={handleCopyChapter}
                           onUpdateChapter={isExtraChapter ? onOpenUpdateExtraChapter : onUpdateChapter}
                           folderId={folderId}
                           handleDelete={handleDelete}
                           content={content}
                           onDeleteChapter={onDeleteChapter}
                           handleMoverChapter={(selectedContent) => handleMoverChapter(selectedContent)}
                           anchorEl={anchorEl}
                           setAnchorEl={setAnchorEl}
                           setChapterIndex={setChapterIndex}
                           loading={loading}
                           chapterIndex={chapterIndex}
                           onChangeChapterIndex={onChangeChapterIndex}
        />
        <div className={'flex justify-end items-center text-[14px] mr-1'}>
          {
            inContent && date &&
            <div className={"w-2 h-2 bg-green-500 rounded-full mr-1"}/>
          }
          {date}
        </div>
      </div>
      {
        openExtraChapter && extraChapter &&
        <MediaChapterDialog open={openExtraChapter}
                            setOpen={setOpenExtraChapter}
                            type={extraChapter?.extraChapterType}
                            maxIndex={chapter?.chapterIndex} contentId={contentId}
                            extraChapter={chapter}/>
      }
      {
        openLinkOrSlide && extraChapter &&
        <LinkChapterDialog open={openLinkOrSlide}
                           setOpen={setOpenLinkOrSlide}
                           type={extraChapter?.extraChapterType}
                           contentId={contentId}
                           maxIndex={chapter?.chapterIndex} chapter={chapter}/>
      }
      {
        openVideo && extraChapter &&
        <VideoChapter open={openVideo}
                      setOpen={setOpenVideo}
                      maxIndex={chapter?.chapterIndex}
                      contentId={contentId}
                      extraChapter={chapter}/>
      }
    </div>
  );
}

export default ChapterItem;
