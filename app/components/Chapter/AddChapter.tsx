import React from 'react';
import ButtonAddImage from "@/app/components/ButtonCustom/ButtonAddImage";

type Props = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  chapterThumb?: string
  setChapterThumb?: React.Dispatch<React.SetStateAction<string>>

}

function AddChapter({
                      value = '',
                      setValue = () => {
                      },
                      chapterThumb = '',
                      setChapterThumb = () => {
                      }
                    }: Props) {
  return (
    <div className='flex items-center w-full gap-4 bg-[#F5F7FB] h-12 overflow-hidden rounded-md'>
      <ButtonAddImage size='w-12 h-12'/>
      <input className='bg-[#F5F7FB] w-full h-full border-none outline-0 text-black' value={value}
             onChange={e => setValue(e.target.value)}
             placeholder='1タイトルタイトル'/>
    </div>
  );
}

export default AddChapter;
