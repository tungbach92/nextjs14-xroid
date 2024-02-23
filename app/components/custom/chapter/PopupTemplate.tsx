import React, {useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {Button, CircularProgress, TextField} from "@mui/material";
import Image from "next/image";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useImageList} from "@/app/components/imagePage";
import Modal from "@/app/components/custom/Modal";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import isURL from "validator/lib/isURL";
import {BlockPopup} from "@/app/types/block";
import {cloneDeep} from "lodash";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {saveButtonPropsAtom} from "@/app/components/Header/SaveButton";

type popupTemplateProps = {
  onDelete: () => void
  onCopy: () => void
  block?: BlockPopup
  handleMultiCopy?: (type: string) => void
  handleGetIndex?: () => void
  isShowAddButton?: boolean
}

function PopupTemplate({
                         onDelete,
                         onCopy,
                         block,
                         handleMultiCopy,
                         handleGetIndex,
                         isShowAddButton,
                       }: popupTemplateProps) {
  useGetImageFolders()
  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const {listImages} = useImageList({})
  const [image, setImage] = useState<string>(block?.data?.url || '')
  const titleRef = useRef<HTMLElement | null>(null)
  const buttonRef = useRef<HTMLElement | null>(null)
  const desRef = useRef<HTMLElement | null>(null)
  const linkRef = useRef<HTMLElement | null>(null)
  const setSaveButtonProps = useSetAtom(saveButtonPropsAtom);
  const [typeError, setTypeError] = useState('')

  const handleUploadImage = async (e) => {
    if (e.target.files.length === 0) return
    setLoading(true)
    const url = await handleUploadFile(e.target.files[0], userInfo?.user_id)
    handleOnChangePopup("url", url)
    setImage(url)

    const _block = cloneDeep(block)
    _block.data.url = url
    updateBlocks(_block)
    setLoading(false)
  }

  const handleOpenSelectImage = (event) => {
    event.preventDefault();
    setOpenModal(true)
  }

  const handleSelectImage = (item) => {
    const _block = cloneDeep(block)
    _block.data.url = item.url
    updateBlocks(_block)
    setImage(item.url)
    setOpenModal(false)
  }

  const handleOnChangePopup = (field: string, value: string) => {
    const _block = cloneDeep(block)
    switch (field) {
      case "bannerTitle":
        if (value.trim().length > 20) {
          setTypeError('title')
        } else {
          setTypeError('')
          _block.data[field] = value
        }
        break;
      case "bannerDescription":
        if (value.trim().length > 140) {
          setTypeError('description')
        } else {
          setTypeError('')
          _block.data[field] = value
        }
        break;
      case "buttonTitle":
        if (value.trim().length > 20) {
          setTypeError('button')
        } else {
          setTypeError('')
          _block.data[field] = value
        }
        break;
      case "bannerLink":
        if (!isURL(value.trim())) {
          setTypeError('link')
        } else {
          setTypeError('')
          _block.data[field] = value
        }
        break;
    }
    updateBlocks(_block)
  }

  return (
    <CardCustom
      isShowAddButton={isShowAddButton}
      isCopy={true}
      onCopy={onCopy}
      block={block}
      color='#caeb00'
      onDelete={onDelete}
      title={'Popup'}
      handleMultiCopy={handleMultiCopy}
      handleGetIndex={handleGetIndex}
      className={`border-2 border-solid border-[#caeb00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full`}
    >
      <div className='flex flex-col justify-center gap-3 w-full'>
        <TextField
          key={block?.data?.bannerTitle + block.id + 'bannerTitle'}
          size='small'
          fullWidth
          defaultValue={block?.data?.bannerTitle}
          onBlur={(e) => handleOnChangePopup("bannerTitle", e.target.value)}
          inputRef={titleRef}
          onFocus={() => setSaveButtonProps((prev) => ({...prev, titleRef}))}
          placeholder='タイトル'
          error={typeError === "title"}
          className='mt-2'
          helperText={`${typeError === "title" ? '最大20文字を入力してください。' : ''}`}
        />
        {
          image ?
            <div className='flex justify-center group relative cursor-pointer'>
              <Image
                onClick={() => setImage('')}
                className='hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:flex'
                src='/icons/trash-icon.svg'
                alt=''
                width={30}
                height={30}
              />
              {
                loading ? <CircularProgress/> : <Image
                  className='object-contain'
                  src={image}
                  alt='image'
                  width={70} height={70}
                />
              }
            </div>
            :
            <div
              className='flex gap-2 items-center w-full justify-center border border-solid rounded-md h-16'>
              <Button onClick={(e) => handleOpenSelectImage(e)}>
                <label className='flex items-center justify-center' htmlFor={`upload-image`}>
                  <Image
                    src='/icons/image-icon.svg'
                    alt='upload-icon'
                    width={20}
                    height={20}
                  />
                </label>
              </Button>
              |
              <Button
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <Image src='/images/upload.svg' alt='upload-icon' width={20} height={20}/>
                <input
                  id={`upload-image`}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={event => handleUploadImage(event)}
                />
              </Button>
            </div>
        }
        <TextField
          key={block?.data?.bannerDescription + block.id + 'bannerDescription'}
          size='small'
          fullWidth
          defaultValue={block?.data?.bannerDescription}
          onBlur={(e) => handleOnChangePopup("bannerDescription", e.target.value)}
          inputRef={desRef}
          error={typeError === "description"}
          onFocus={() => setSaveButtonProps((prev) => ({...prev, desRef}))}
          placeholder='説明'
          helperText={`${typeError === "description" ? '最大140文字を入力してください。' : ''}`}
        />
        <TextField
          key={block?.data?.buttonTitle + block.id + 'buttonTitle'}
          size='small'
          fullWidth
          defaultValue={block?.data?.buttonTitle}
          onBlur={(e) => handleOnChangePopup("buttonTitle", e.target.value)}
          inputRef={buttonRef}
          error={typeError === "button"}
          onFocus={() => setSaveButtonProps((prev) => ({...prev, buttonRef}))}
          placeholder='ボタンの文字'
          helperText={`${typeError === "button" ? '最大20文字を入力してください。' : ''}`}
        />
        <TextField
          key={block?.data?.bannerLink + block.id + 'bannerLink'}
          size='small'
          fullWidth
          defaultValue={block?.data?.bannerLink}
          onBlur={(e) => handleOnChangePopup("bannerLink", e.target.value)}
          inputRef={linkRef}
          onFocus={() => setSaveButtonProps((prev) => ({...prev, linkRef}))}
          placeholder='URL'
          error={typeError === "link"}
          helperText={`${typeError === 'link' ? 'URLが正しくありません' : ''}`}
          className='mb-4'
        />
      </div>
      {
        openModal &&
        <Modal
          open={openModal}
          setOpen={setOpenModal}
          title={'画像を選択してください。'}
          handleClose={() => setOpenModal(false)}
          btnSubmit={'選択する'}
        >
          <div className={'flex justify-center items-center m-auto'}>
            {listImages?.length > 0 ?
              <ImageList sx={{width: 400, height: 320}} cols={3} rowHeight={104}>
                {listImages?.map((item) => (
                  <ImageListItem key={item.url}>
                    <img
                      src={item.url}
                      className={'w-24 h-24 object-contain cursor-pointer'}
                      alt={'image'}
                      loading="lazy"
                      onClick={() => handleSelectImage(item)}
                    />
                  </ImageListItem>
                ))}
              </ImageList> :
              <div
                className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold`}>画像がございません。</div>
            }
          </div>
        </Modal>
      }
    </CardCustom>
  );
}

export default PopupTemplate;
