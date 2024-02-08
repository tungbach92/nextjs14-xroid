import React, {useEffect, useState} from 'react';
import {CssTextField} from "@/app/components/custom/CssTextField";
import Modal from "@/app/components/custom/Modal";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import Image from "next/image";
import {getOgp} from "@/app/common/commonApis/ogp";
import Checkbox from "@mui/material/Checkbox";
import UploadOnlyImage from "@/app/components/custom/UploadOnlyImage";
import {LinkAndSlideChapter} from "@/app/types/types";
import {getId} from "@/app/common/getId";
import {createExtraChapter, updateExtraChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";
import faviconFetch from 'favicon-fetch';


type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  type: string
  maxIndex?: number
  chapter?: LinkAndSlideChapter
  contentId?: string
}

const initialChapterState = {
  url: '',
  contentId: '',
  title: '',
  description: '',
  thumbnail: '',
  buttonTitle: '',
}

function LinkChapterDialog({open, setOpen, type, maxIndex, chapter, contentId}: Props) {
  const [chapterData, setChapterData] = useState<LinkAndSlideChapter>({...initialChapterState})
  const [isGoogleSlide, setIsGoogleSlide] = useState<boolean>(false)
  const isLinkChapter = type === 'link'
  useEffect(() => {
    if (!chapter) return;
    if (chapter) {
      setChapterData(chapter)
    }
  }, [chapter]);
  useEffect(() => { // fetch ogp data
    const fetchOgpData = async () => {
      const linkData = {
        url: chapterData.url
      }
      try {
        const response = await getOgp(linkData);
        if (!response.data) return
        if (chapter) return;
        setChapterData({
          ...chapterData,
          contentId,
          title: response!.data!.title || '',
          description: response!.data!.description || '',
          thumbnail: response!.data!.image || ''
        });
      } catch (error) {
        console.error('Error fetching OGP data:', error);
      }
    };
    if (chapterData.url) {
      fetchOgpData().then(r => r)
    }
  }, [chapterData.url]);
  const onClose = () => {
    setOpen(false)
    setChapterData({})
  }
  const onChangeUrl = (e) => {
    if (!isLinkChapter) {
      const googleSlideRegex = /^https?:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9-_]+/;
      if (googleSlideRegex.test(e.target.value.trim())) {
        setIsGoogleSlide(true);
      } else {
        setIsGoogleSlide(false);
      }
    }
    setChapterData({...chapterData, url: e.target.value})
  }


  const onUploadThumbnail = (image: string) => {
    setChapterData({...chapterData, thumbnail: image})
  }
  const onChange = (e, type: string) => {
    setChapterData({...chapterData, [type]: e.target.value})
  }


  const onCheck = () => {
    setChapterData({...chapterData, isSettingCube: !chapterData.isSettingCube})
  }
  const onSubmit = async () => {
    if (!chapterData.url) {
      toast.error('URLを入力してください。')
      return;
    }
    const data = {
      ...chapterData,
      id: getId('chapter_', 8),
      contentId,
      chapterIndex: maxIndex ? maxIndex + 1 : 0,
      extraChapterType: isLinkChapter ? 'link' : 'slide',
      url: chapterData.url,
      title: chapterData.title,
      description: chapterData.description,
      thumbnail: chapterData.thumbnail,
      buttonTitle: chapterData.buttonTitle,
      isSettingCube: chapterData.isSettingCube,
    }
    try {
      if (!chapter?.url) {
        await createExtraChapter(data)
        toast.success('作成に成功しました。')
      } else {
        await updateExtraChapter({...data, id: chapter.id})
        toast.success('更新に成功しました。')
      }
    } catch (e) {
      console.log(e);
      toast.error('保存できません。')
    } finally {
      onClose()
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
               <div className={'flex gap-2 text-xl items-center'}>
                 {isLinkChapter ? <InsertLinkIcon className={'-rotate-45 w-[40px] h-[40px]'}/> :
                   <Image src="/icons/content/slide.svg" alt="" width={24} height={30}
                          className={"cursor-pointer my-auto"}
                   />}
                 <span className={'my-auto'}>
                    {isLinkChapter ? 'リンク' : 'Google Slides のコピー'}
                 </span>
               </div>
             }
             onSubmit={onSubmit}
             open={open}
             setOpen={setOpen}
             handleClose={onClose}
      >
        <div className={'w-[90%] mx-auto flex flex-col'}>
          <CssTextField
            className={'mb-2'}
            error={!isGoogleSlide && !isLinkChapter && Boolean(chapterData.url)}
            helperText={!isGoogleSlide && !isLinkChapter && Boolean(chapterData.url) ? 'Google Slides のコピーを追加してください。' : ''}
            onChange={(e) => onChangeUrl(e)}
            value={chapterData.url}
            size={'small'}
            fullWidth
            placeholder={isLinkChapter ? 'URLを追加してください。' : 'プレゼンテーションURLを追加してください。'}
            variant="outlined"
          />
          <div className={'flex items-center gap-[1px] border border-solid border-gray-300 p-1 rounded relative'}>
            <UploadOnlyImage
              iconSize={30}
              uploadOrSelectClassName={'flex mx-4'}
              imageHeight={83}
              imageWidth={83}
              image={chapterData?.thumbnail}
              onChangeData={(image) => onUploadThumbnail(image)}/>
            {!isLinkChapter &&
              <Image src="/icons/content/slide.svg" alt="" width={24} height={30}
                     className={"cursor-pointer my-auto absolute bottom-1 right-1"}/>
            }
            {
              isLinkChapter && chapterData?.url ?
                <img src={faviconFetch({uri: chapterData?.url})} alt={'favicon'}
                     className={'absolute bottom-1 right-1 w-[35px] cursor-pointer rounded-full'} onClick={()=>{
                       window.open(chapterData?.url, '_blank')
                }}/> :
                isLinkChapter && !chapterData?.url &&
                <InsertLinkIcon className={'-rotate-45 w-[35px] h-[35px] absolute -bottom-1 right-1 pl-2 cursor-pointer'}
                                onClick={() => window.open(chapterData?.url, '_blank')}
                />
            }
            <div className={'w-full'}>
              <CssTextField
                sx={{"& fieldset": {border: 'none'}}}
                rows={3}
                maxRows={3}
                placeholder={'タイトル'}
                value={chapterData ? chapterData?.title : 'このリンクはタイトルがありません。'}
                onChange={(e) => onChange(e, 'title')}
                size={'small'}
                multiline={true}
                variant="outlined"
                className={'w-[93%]'}
              />
            </div>
          </div>
          <img
            src={chapterData?.thumbnail ? chapterData?.thumbnail : isLinkChapter ? "/icons/noThumb.svg" : "/icons/squareSlideIcon.svg"}
            alt={'thumbnail'}
            className={'w-[180px] h-[180px] mx-auto mt-5'}
          />
          <CssTextField
            placeholder={'説明'}
            maxRows={3}
            value={chapterData ? chapterData?.description : ''}
            onChange={(e) => onChange(e, 'description')}
            size={'small'}
            variant="outlined"
            className={'w-full mx-auto mt-5'}
          />
          <CssTextField
            placeholder={'ボタンの文字'}
            maxRows={3}
            value={chapterData ? chapterData?.buttonTitle : ''}
            onChange={(e) => onChange(e, 'buttonTitle')}
            size={'small'}
            variant="outlined"
            className={'w-full mx-auto mt-5'}
          />
          <div className={'flex text-center items-center -ml-3'}>
            <Checkbox checked={!!chapterData?.isSettingCube}
                      onChange={() => onCheck()}/>
            <span>課金設定を適用</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LinkChapterDialog;
