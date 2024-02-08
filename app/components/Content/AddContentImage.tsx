import React from 'react';
import UploadOnlyImage from '../custom/UploadOnlyImage';
import {toast} from "react-toastify";

type Props = {
  loading?: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  previewUrl?: string
  setPreviewUrl?: (value: string) => void
  className?: string
  onChange?: () => void
  fileType?: string
  size?: string
  isNoResponse?: boolean
}

function AddContentImage({loading, setLoading, isNoResponse = false,
                           previewUrl, setPreviewUrl, className, onChange, fileType, size}: Props) {
  const onChangeData = (value: string) => {
    if (value.includes('.gif')) return toast.error("表紙の画像形成が正しくありません。静止画を使ってください。")
    setPreviewUrl(value)
  }

  return (
    <div
      className={`flex items-center m-auto justify-center ${!isNoResponse && 'border-dashed border border-blue-600 h-[210px] w-[180px]'} overflow-hidden rounded-lg ${className}`}>
      <UploadOnlyImage id='1'
                       image={previewUrl}
                       index={1}
                       onChangeData={onChangeData}
      />
    </div>
  );
}

export default AddContentImage;
