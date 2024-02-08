import React from 'react';
import {Button} from "@mui/material";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtomValue, useSetAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import CircularProgress from '@mui/material/CircularProgress';
import {twMerge} from "tailwind-merge";
import {Chapter} from "@/app/types/types";
import {toast} from "react-toastify";
import {clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type Props = {
  size?: string,
  sizeDefault?: string,
  className?: string,
  loading?: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
  previewUrl?: string
  setPreviewUrl?: React.Dispatch<React.SetStateAction<string>>,
  setChapter?: React.Dispatch<React.SetStateAction<Chapter>>,
  setIsOldUrl?: any
  onChange?: () => void
  fileType?: string
}

function ButtonAddImage({
                          size,
                          sizeDefault = '',
                          className,
                          loading = false,
                          setLoading = () => {
                          },
                          previewUrl = '',
                          setChapter = () => {
                          },
                          setIsOldUrl = () => {
                          },
                          onChange, fileType
                        }: Props) {
  const {user_id} = useAtomValue(userAtomWithStorage)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)
  const handleChange = async (e) => {
    const files = e.target.files
    if (files.length === 0) return
    if (files[0].type === 'image/gif') return toast.error('表紙の画像形成が正しくありません。静止画を使ってください。')
    setLoading(true)
    const url = await handleUploadFile(files[0], user_id)
    if (url === previewUrl) {
      setIsOldUrl(true)
    } else {
      setChapter({thumbnail: url})
      setIsOldUrl(false)
      clearChapterError('thumb')
    }
    setLoading(false)
  }

  return (
    <Button
      color="primary"
      aria-label="upload picture"
      component="label"
      className={`hover:bg-none ${className}`}
    >
      <input hidden accept={`${fileType || 'image/*'}`} type="file" onChange={onChange ?? handleChange}/>
      {loading ? <CircularProgress/> :
        <img
          className={twMerge(`object-contain ${previewUrl ? size : sizeDefault}`, `${previewUrl === '/icons/no-image-frees.png' && 'w-[150px] h-[180px]'}`)}
          src={previewUrl ? previewUrl : `${!fileType ? '/icons/add-image.svg' : '/icons/add-music.svg'}`}
          alt='add-image-icon'/>
      }
    </Button>
  );
}

export default ButtonAddImage;
