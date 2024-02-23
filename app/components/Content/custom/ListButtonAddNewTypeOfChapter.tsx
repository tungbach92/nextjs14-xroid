import React, {useState} from 'react';
import {Button} from "@mui/material";
import MediaChapterDialog from "@/app/components/Content/dialog/MediaChapterDialog";
import LinkChapterDialog from "@/app/components/Content/dialog/LinkChapterDialog";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {getPlanJpText} from "@/app/common/getPlanJpText";
import {CF_EMAIL, OWNER_EMAILS, OWNER_ID} from "../../../../common/ownerId";
import AddIcon from "@mui/icons-material/Add";
import VideoChapter from "@/app/components/Content/dialog/VideoChapter";
import {isEnterpriseAtom} from "@/app/store/atom/isEnterprise.atom";

const ListButton = [
  {
    id: 1,
    label: 'リンク',
    icon: '/icons/content/link.svg',
    type: 'link'
  },
  {
    id: 2,
    label: 'Youtube',
    icon: '/icons/content/youtube.svg',
    type: 'youtube'
  },
  {
    id: 3,
    label: 'Vimeo',
    icon: '/icons/content/vimeo.svg',
    type: 'vimeo'
  },
  {
    id: 4,
    label: 'スライド',
    icon: '/icons/content/slide.svg',
    type: 'slide'
  },
  {
    id: 5,
    label: '動画',
    icon: '/icons/content/white_video_icon.svg',
    type: 'video'

  }
]

type Props = {
  className?: string
  maxIndex?: number
  contentId?: string
  isLink?: boolean
}

function ListButtonAddNewTypeOfChapter({className, maxIndex, contentId, isLink}: Props) {
  const [openYoutube, setOpenYoutube] = useState<boolean>(false)
  const [openVimeo, setOpenVimeo] = useState<boolean>(false)
  const [openSlide, setOpenSlide] = useState<boolean>(false)
  const [openLink, setOpenLink] = useState<boolean>(false)
  const [openVideo, setOpenVideo] = useState<boolean>(false)
  const [userInfo,] = useAtom(userAtomWithStorage)
  const plan = getPlanJpText(userInfo?.plan)
  const checkIsFreePlan = plan === 'フリー'
  const checkIsClassFunc = userInfo?.email?.includes(CF_EMAIL)
  const [isEnterprise, setIsEnterprise] = useAtom(isEnterpriseAtom)
  const isSuperAdmin = userInfo?.user_id === OWNER_ID
  const isProUser =OWNER_EMAILS?.includes(userInfo?.email)
  const lockCondition = checkIsFreePlan && !checkIsClassFunc && !isEnterprise && !isSuperAdmin && !isProUser


  const onClickButton = (type: string) => {
    switch (type) {
      case 'youtube':
        setOpenYoutube(true)
        break
      case 'vimeo':
        setOpenVimeo(true)
        break
      case 'slide':
        setOpenSlide(true)
        break
      case 'link':
        setOpenLink(true)
        break
      case 'video':
        setOpenVideo(true)
        break
      default:
        break
    }
  }
  return (
    <div className={className}>
      {
        ListButton.map((item, index) => {
            if (isLink && item.type !== 'link') return null
            if (!isLink && item.type === 'link') return null
            return (
              <Button variant={'contained'}
                      key={index + item.type}
                      className={`font-bold text-xs ${lockCondition && item.type !== 'youtube' && 'opacity-50 px-3'}`}
                      startIcon={<img src={item.icon} alt='icon' className={'w-6 h-6'}/>}
                      endIcon={
                        lockCondition && item.type !== 'youtube' &&
                        <div className={'w-6 h-6 bg-white flex rounded-full'}>
                          <img src={'/icons/lock-icon.svg'} alt='icon' className={'w-4 h-4 m-auto'}/>
                        </div>
                      }
                      onClick={() => lockCondition && item.type !== 'youtube' ? {} : onClickButton(item.type)}
              >
                <div className={'flex items-center text-center'}>
                  <span>{item.label}</span>
                  <AddIcon className={'w-5'}/>
                </div>
              </Button>
            )
          }
        )
      }
      <MediaChapterDialog open={openYoutube}
                          setOpen={setOpenYoutube}
                          type={'youtube'}
                          maxIndex={maxIndex}
                          contentId={contentId}
      />
      <MediaChapterDialog open={openVimeo}
                          setOpen={setOpenVimeo}
                          type={'vimeo'}
                          maxIndex={maxIndex}
                          contentId={contentId}
      />
      <VideoChapter open={openVideo}
                    setOpen={setOpenVideo}
                    maxIndex={maxIndex}
                    contentId={contentId}
      />
      <LinkChapterDialog open={openLink}
                         setOpen={setOpenLink}
                         type={'link'}
                         maxIndex={maxIndex}
                         contentId={contentId}
      />
      <LinkChapterDialog open={openSlide}
                         setOpen={setOpenSlide}
                         type={'slide'}
                         maxIndex={maxIndex}
                         contentId={contentId}
      />
    </div>
  );
}

export default ListButtonAddNewTypeOfChapter;
