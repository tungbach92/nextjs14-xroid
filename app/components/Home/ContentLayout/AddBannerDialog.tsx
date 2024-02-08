import React, {useEffect, useState} from 'react';
import DialogCustom from "@/app/components/DialogCustom";
import {Button, TextField} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import isURL from "validator/lib/isURL";
import {createDataChapter, updateDataChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";
import {ChapterWithPurChaseSetting} from "@/app/common/chapterPurchaseSetting";
import {Chapter} from "@/app/types/types";

type Props = {
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  oldBanner?: ChapterWithPurChaseSetting
  contentId?: string | string[]
  isCreate?: boolean,
  maxIndex?: number
}

const initialDataBanner: Chapter = {
  bannerTitle: '',
  thumbnail: '',
  thumbnailPopup: '',
  buttonTitle: '',
  bannerDescription: '',
  bannerLink: ''
}

function AddBannerDialog({
  open,
  setOpen,
  oldBanner,
  contentId,
  isCreate, maxIndex
}: Props) {
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [loading, setLoading] = useState(false)
  const [loadingThumbPopup, setLoadingThumbPopup] = useState(false)
  const [isError, setIsError] = useState('')
  const [banner, setBanner] = useState<Chapter>({
    bannerTitle: '',
    thumbnail: '',
    thumbnailPopup: '',
    buttonTitle: '',
    bannerDescription: '',
    bannerLink: ''
  })

  useEffect(() => {
    setBanner({
      bannerTitle: oldBanner?.bannerTitle ?? initialDataBanner.bannerTitle,
      thumbnail: oldBanner?.thumbnail ?? initialDataBanner.thumbnail,
      thumbnailPopup: oldBanner?.thumbnailPopup ?? initialDataBanner.thumbnailPopup,
      buttonTitle: oldBanner?.buttonTitle ?? initialDataBanner.buttonTitle,
      bannerDescription: oldBanner?.bannerDescription ?? initialDataBanner.bannerDescription,
      bannerLink: oldBanner?.bannerLink ?? initialDataBanner.bannerLink
    })
  }, [oldBanner])

  const handleUploadImage = async (e: any, field: string) => {
    const files = e.target.files
    if (files?.length === 0) return
    if (files?.[0].type === 'image/gif') return toast.error('表紙の画像形成が正しくありません。静止画を使ってください。')
    try {
      field === 'thumbnail' ? setLoading(true) : setLoadingThumbPopup(true)
      const url = await handleUploadFile(files?.[0], userInfo?.user_id)
      setBanner({
        ...banner,
        [field]: url,
      })
    } catch (e) {
      console.log(e)
    } finally {
      field === 'thumbnail' ? setLoading(false) : setLoadingThumbPopup(false)
    }
  }

  const handleChangeDataBanner = (type: string, e) => {
    switch (type) {
      case 'bannerTitle':
        if (e.target.value.length > 20) {
          setIsError('bannerTitle')
          return
        } else {
          setIsError('')
          setBanner({
            ...banner,
            bannerTitle: e.target.value,
          })
        }
        break
      case 'buttonTitle':
        if (e.target.value.length > 20) {
          setIsError('buttonTitle')
          return;
        } else {
          setIsError('')
          setBanner({
            ...banner,
            buttonTitle: e.target.value,
          })
        }
        break
      case 'bannerDescription':
        if (e.target.value.length > 140) {
          setIsError('bannerDescription')
          return;
        } else {
          setIsError('')
          setBanner({
            ...banner,
            bannerDescription: e.target.value
          })
        }
        break
      case 'bannerLink':
        if (!isURL(e.target.value)) {
          setIsError('bannerLink')
        } else {
          setIsError('')
        }
        setBanner({
          ...banner,
          bannerLink: e.target.value
        })
        break;
    }
  }

  const createBanner = async () => {
    try {
      await createDataChapter({
        ...banner,
        chapterIndex: maxIndex ? maxIndex + 1 : 0,
        contentId: contentId,
        isBanner: true,
        isShowBanner: true
      })
      toast.success('チャプターを更新しました')
      setOpen(false)
    } catch (e) {
      toast.error('チャプターを更新できませんでした')
      setOpen(true)
    }
  }

  const onUpdateBanner = async () => {
    try {
      const data: Chapter = {
        ...oldBanner,
        thumbnail: banner?.thumbnail ?? initialDataBanner.thumbnail,
        thumbnailPopup: banner?.thumbnailPopup ?? initialDataBanner.thumbnailPopup,
        bannerLink: banner?.bannerLink ?? initialDataBanner.bannerLink,
        bannerTitle: banner?.bannerTitle ?? initialDataBanner.bannerTitle,
        buttonTitle: banner?.buttonTitle ?? initialDataBanner.buttonTitle,
        bannerDescription: banner?.bannerDescription ?? initialDataBanner.bannerDescription,
      }
      await updateDataChapter(data)
      toast.success('チャプターを更新しました')
      setOpen(false)
    } catch (e) {
      console.log(e)
      toast.error('チャプターを更新できませんでした')
      setOpen(true)
    }
  }

  const handleClose = () => {
    if (oldBanner !== undefined) return;
    setBanner({
      bannerTitle: '',
      thumbnail: '',
      thumbnailPopup: '',
      buttonTitle: '',
      bannerDescription: '',
      bannerLink: ''
    })
  }


  return (
    <>
      <DialogCustom open={open} setOpen={setOpen}
                    disable={(!banner?.thumbnail || !banner?.bannerLink) || loading} title='バナー追加'
                    onClick={isCreate ? createBanner : onUpdateBanner}
                    loading={loading}
                    onClose={handleClose}>
        <div className='flex flex-col gap-6 w-full'>
          <TextField size={'small'}
                     fullWidth
                     value={banner?.bannerTitle}
                     onChange={(e) => handleChangeDataBanner('bannerTitle', e)}
                     placeholder='タイトル'
                     error={isError === 'bannerTitle'}
                     helperText={isError === 'bannerTitle' ? '最大20文字を入力してください。' : ''}

          />
          <Button
            color="primary"
            aria-label="upload picture"
            component="label"
            className={'border-dashed border border-blue-600'}
          >
            {
              loading ?
                <CircularProgress/>
                :
                <img
                  src={banner?.thumbnail ? banner?.thumbnail : '/addIcon.svg'}
                  alt='upload-icon'
                  className={banner?.thumbnail ? 'w-full aspect-[1080/200] object-cover' : 'w-[40px] h-[40px]'}
                />
            }
            <input
              id={`upload-image`}
              hidden
              accept="image/*"
              type="file"
              onChange={event => handleUploadImage(event, 'thumbnail')}
            />
          </Button>
          {
            banner?.thumbnail &&
            <div className={'text-center text-xs opacity-70'}>* 画像の推奨比例 1080px:200px</div>
          }
          <Button
            color="primary"
            aria-label="upload picture"
            component="label"
            className={'aspect-square border-dashed border border-blue-600'}
          >
            {
              loadingThumbPopup ?
                <CircularProgress/>
                :
                <img
                  src={banner?.thumbnailPopup ? banner?.thumbnailPopup : '/addIcon.svg'}
                  alt='upload-icon'
                  className={banner?.thumbnailPopup ? 'w-full aspect-[1080/1080] object-cover' : 'w-[40px] h-[40px]'}
                />
            }
            <input
              id={`upload-image`}
              hidden
              accept="image/*"
              type="file"
              onChange={event => handleUploadImage(event, 'thumbnailPopup')}
            />
          </Button>
          {
            banner?.thumbnailPopup &&
            <div className={'text-center text-xs opacity-70'}>* 画像の推奨比例 1080px:1080px</div>
          }

          <TextField size={'small'}
                     fullWidth
                     value={banner?.bannerDescription}
                     onChange={(e) => handleChangeDataBanner('bannerDescription', e)}
                     placeholder='説明'
                     error={isError === 'bannerDescription'}
                     helperText={isError === 'bannerDescription' ? '最大140文字を入力してください。' : ''}
          />
          <TextField size={'small'}
                     fullWidth
                     value={banner?.buttonTitle}
                     onChange={(e) => handleChangeDataBanner('buttonTitle', e)}
                     placeholder='ボタンの文字'
                     error={isError === 'buttonTitle'}
                     helperText={isError === 'buttonTitle' ? '最大20文字を入力してください。' : ''}
          />
          <TextField size={'small'}
                     fullWidth
                     value={banner?.bannerLink}
                     onChange={(e) => handleChangeDataBanner('bannerLink', e)}
                     placeholder='URL'
                     error={isError === 'bannerLink'}
                     helperText={isError === 'bannerLink' ? 'URLが正しくありません' : ''}
          />
        </div>
      </DialogCustom>
    </>
  );
}

export default AddBannerDialog;
