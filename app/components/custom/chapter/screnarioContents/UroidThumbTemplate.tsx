import React, {useEffect} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {BlockURoidDefaultImage, BlockURoidThumbnail, DataUroid} from "@/app/types/block";
import {Button} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";
import {cloneDeep} from "lodash";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidThumbnail
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleCheckField: (e) => void
  handleUploadImage: (e) => Promise<void>
  loading: boolean
  chapter: Chapter
}

function UroidThumbTemplate({
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
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const condition = chapterError.uRoidThumbnail && !block.data.isUserAction && !block.data.thumbUrl && chapter?.chapterType === 'createURoid'
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const defaultImageBlock = blocks.find((block) => block.type === 'uRoid_defaultImage') as BlockURoidDefaultImage

  useEffect(() => {
    const _block = cloneDeep(block)

    if (defaultImageBlock) {
      _block.data.isDefaultImage = true
      updateBlocks(_block)
    } else {
      _block.data.isDefaultImage = false
      updateBlocks(_block)
    }

    if (defaultImageBlock && _block?.data?.isDefaultImage) {
      const dataUroid = _block.data as DataUroid
      dataUroid.thumbUrl = defaultImageBlock?.data?.imageUrl
      _block.data = dataUroid
      updateBlocks(_block)
    }
  }, [defaultImageBlock?.data?.imageUrl])
  const handleCheckDefaultImage = (e) => {
    const _block = cloneDeep(block)
    const dataUroid = _block.data as DataUroid
    dataUroid.isDefaultImage = e.target.checked
    _block.data = dataUroid
    updateBlocks(_block)
  }
  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Thumbnail'} color={`${condition ? 'red' : '#1976D2'} `}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'} min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full relative text-white`}>
        <div className={'2xl:flex 2xl:gap-10'}>

          <FormControlLabel name={'isUserAction'} control={<Checkbox checked={block.data.isUserAction}
                                                                     onChange={handleCheckField}/>}
                            label="ユーザーアップロード" className={'text-black'}/>
          {
            defaultImageBlock &&
            <FormControlLabel control={<Checkbox checked={block?.data?.isDefaultImage}
                                                 defaultChecked={true}
                                                 onChange={(e) => handleCheckDefaultImage(e)}/>}
                              label="デフォルトイメージ" className={'text-black'}/>
          }
        </div>
        <div className={'flex gap-3 my-3 items-center'}>
          <Button
            color="primary"
            aria-label="upload picture"
            component="label"
            className='border border-dashed w-[84px] aspect-square rounded-md flex items-center justify-center overflow-hidden'
            disabled={block.data.isUserAction || block?.data?.isDefaultImage}
          >
            <input
              name={'thumbUrl'}
              onChange={handleUploadImage}
              hidden accept="image/*" type="file"/>
            {
              loading ? <CircularProgress/>
                :
                <img src={block?.data?.thumbUrl || '/icons/add-image.svg'} alt="UroidThumb"
                     className={`object-cover max-w-[84px] w-auto h-auto
                     ${(block.data.isUserAction || block?.data?.isDefaultImage) && 'opacity-30'}`}/>
            }
          </Button>
        </div>
      </CardCustom>
    </div>
  );
}

export default UroidThumbTemplate;
