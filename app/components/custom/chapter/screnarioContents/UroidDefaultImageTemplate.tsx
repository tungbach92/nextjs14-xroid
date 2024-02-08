import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {BlockURoidDefaultImage} from "@/app/types/block";
import {Button} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {useAtomValue} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidDefaultImage
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleCheckField: (e) => void
  handleUploadImage: (e) => Promise<void>
  loading: boolean
  chapter: Chapter
}

function UroidDefaultImageTemplate({
                                     onCopy,
                                     onDelete,
                                     block,
                                     isShowAddButton,
                                     handleGetIndex,
                                     handleMultiCopy,
                                     handleCheckField,
                                     handleUploadImage,
                                     loading,
                                     chapter
                                   }: props) {

  const chapterError = useAtomValue(chapterErrorAtom)
  const condition = chapterError.uRoidDefaultImage && !block.data.isUserAction && !block.data.imageUrl && chapter?.chapterType === 'createURoid'

  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Default Image'} color={`${condition ? 'red' : '#1976D2'} `}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'}  min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full relative text-white`}>
        <FormControlLabel name={'isUserAction'} control={<Checkbox checked={block?.data?.isUserAction}
                                                                   onChange={handleCheckField}/>}
                          label="ユーザーアップロード" className={'text-black'}/>
        <div className={'flex my-3 gap-3'}>
          <Button
            color="primary"
            aria-label="upload picture"
            component="label"
            className='border border-dashed w-[84px] aspect-square rounded-md flex items-center justify-center overflow-hidden'
            disabled={block?.data?.isUserAction}
          >
            <input
              name={'imageUrl'}
              onChange={handleUploadImage}
              hidden accept="image/*" type="file"/>
            {
              loading ? <CircularProgress/>
                :
                <img src={block?.data?.imageUrl || '/icons/add-image.svg'} alt="UroidDefaultImage"
                     className={`object-cover max-w-[84px] w-auto h-auto ${block?.data?.isUserAction && 'opacity-30'}`}/>
            }
          </Button>

        </div>
      </CardCustom>
    </div>
  );
}

export default UroidDefaultImageTemplate;
