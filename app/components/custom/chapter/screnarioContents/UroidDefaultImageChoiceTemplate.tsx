import React, {useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {cloneDeep} from "lodash";
import {BlockURoidDefaultImageChoice} from "@/app/types/block";
import {Button} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {iconImg} from "@/app/components/assets/image/icon";
import {Warning} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import {useAtomValue} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";
import UroidDefaultImageRandomTemplate
  from "@/app/components/custom/chapter/screnarioContents/UroidDefaultImageRandomTemplate";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidDefaultImageChoice
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  chapter: Chapter
}

function UroidDefaultImageTemplate({
                                     onCopy,
                                     onDelete,
                                     block,
                                     isShowAddButton,
                                     handleGetIndex,
                                     handleMultiCopy,
                                     chapter
                                   }: props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [error, setError] = useState<string>('')
  const handleUploadThumb = async (e) => {
    const files: File[] = Array.from(e.target?.files)
    if (files.length === 0) return
    if (block?.data?.imageUrls?.length + files.length > 10) {
      setError(`最大10枚の画像をアップロードできます。`)
      return
    }

    setError('')
    try {
      setLoading(true)
      const _block = cloneDeep(block)
      const urls = await Promise.all(files.map(async file =>
        await handleUploadFile(file, userInfo?.user_id)
      ))
      _block.data.imageUrls = [..._block.data.imageUrls, ...urls]
      updateBlocks(_block)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  const chapterError = useAtomValue(chapterErrorAtom)
  const condition = chapterError.uRoidDefaultImageChoice && !block.data.imageUrls?.length && chapter?.chapterType === 'createURoid'
  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Choose Default Image '} color={`${condition ? 'red' : '#1976D2'} `}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'}  min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full text-white`}>
        {error && <div className={'flex gap-1 items-center text-md text-red-500 my-3'}><Warning/>{error}</div>}
        <div className={'flex gap-3 my-3 overflow-x-scroll'}>
          <Button
            color="primary"
            aria-label="upload picture"
            component="label"
            className='border border-dashed min-w-[84px] aspect-square rounded-md flex items-center justify-center overflow-hidden'
          >
            <input
              onChange={handleUploadThumb}
              hidden accept="image/*" type="file" multiple/>
            {
              loading ? <CircularProgress/>
                :

                <img src={'/icons/add-image.svg'} alt="UroidDefaultImage"
                     className={'object-contain'}/>
            }
          </Button>
          {block?.data?.imageUrls?.map((url, index) =>
            <div key={url + index}
                 className='border border-dashed min-w-[84px] aspect-square rounded-md flex items-center justify-center overflow-hidden relative group/item'>
              <img src={url || iconImg.noImageIcon} alt="UroidDefaultImage"
                   className={'object-cover max-w-[84px] w-auto h-auto '}/>
              <IconButton
                className={'absolute top-0 right-0 w-[20px] bg-white h-[20px] opacity-0 group-hover/item:opacity-100'}
                size={'small'} onClick={() => {
                const _block = cloneDeep(block)
                _block.data.imageUrls.splice(index, 1)
                updateBlocks(_block)
              }}>
                <ClearIcon fontSize={'small'} color={'error'}/>
              </IconButton>
            </div>
          )}
        </div>
      </CardCustom>
    </div>
  );
}

export default UroidDefaultImageTemplate;
