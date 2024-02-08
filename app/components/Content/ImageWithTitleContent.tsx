import React, {useEffect} from 'react';
import AddContentImage from "@/app/components/Content/AddContentImage";
import {ContentState} from "@/app/types/content";

interface ImageWithTitleContentProps {
  loading?: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  setPreviewUrl?: (value: string) => void
  setPreviewImageTitle: (value: string) => void
  state: ContentState,
}

function ImageWithTitleContent({
                                 loading,
                                 setLoading,
                                 state,
                                 setPreviewImageTitle,
                                 setPreviewUrl
                               }: ImageWithTitleContentProps) {
  useEffect(() => {
    setPreviewImageTitle(state.imageTitle)
  }, [state.imageTitle])

  const handleChangeTitle = (e) => {
    setPreviewImageTitle(e.target.value)
  }
  return (
    <div className='grid grid-cols-2 gap-14'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>タイトル</label>
          <input value={state.previewImageTitle}
                 className='h-8 outline-0 bg-gray-200 rounded-md border-0 p-1.5 text-black w-[180px]'
                 onChange={handleChangeTitle}/>
        </div>
        <AddContentImage
          loading={loading}
          setLoading={setLoading}
          previewUrl={state.previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <label>プレビュー</label>
        <div className='flex flex-col gap-4 items-center border border-solid rounded-md h-full px-2'>
          <label className='h-10 flex items-center'>{state.previewImageTitle}</label>
          <img className='border border-dashed w-full h-full rounded-md m-2 object-contain h-[210px] w-[180px]'
               src={state.previewUrl || state.thumb || '/icons/no-image-frees.png'} alt='previewUrl'/>
        </div>
      </div>
    </div>
  );
}

export default ImageWithTitleContent;
