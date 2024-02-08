import React, {useState} from 'react';
import {CssTextField} from "@/app/components/custom/CssTextField";
import {cloneDeep} from "lodash";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {toast} from "react-toastify";
import {Button} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import Modal from "@/app/components/custom/Modal";

type SeparateProps = {
  separate?: any,
  setSeparate?: any,
  state: any,
  setState: any,
  user_id: string,
  forType: string,
}

const listSeparateContent = [
  {
    id: 1,
    title: '別コース名',
    type: 'title',
  },
  {
    id: 3,
    title: '別説明',
    type: 'description',
  }
]

const listSeparateChapter = [
  {
    id: 1,
    title: '別コース名',
    type: 'course',
  },
  {
    id: 2,
    title: '別タイトル',
    type: 'title',
  },
  {
    id: 3,
    title: '別説明',
    type: 'description',
  }
]


function SeparateCustom({separate, setSeparate, state, setState, user_id, forType}: SeparateProps) {
  const [loadingImg, setLoadingImg] = useState(false)
  const [open, setOpen] = useState(false)

  const onChangeSeparate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    const newState = cloneDeep(state);
    const _separateChapter = newState.separateSettings;
    if (_separateChapter) {
      _separateChapter[type] = e.target.value;
    }
    newState.separateSettings = _separateChapter;
    setState(newState);
  }

  const onBlurSeparate = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    /// Case for content: onBlur true, for chapter: onBlur false
    if (forType !== 'content' || separate?.id === 'create' || !separate?.id) return;
    try {
      await updateContent({
        ...separate,
        separateSettings: {
          ...separate.separateSettings,
          [type]: e.target.value
        }
      })
      if (type === 'title') {
        toast.success('別コース名を更新しました。', {autoClose: 3000})
      } else {
        toast.success('別説明を更新しました。', {autoClose: 3000})
      }
    } catch (e) {
      console.log(e);
    }
  }

  const onChangeThumbnail = async (e) => {
    const newState = cloneDeep(state);
    const _separate = newState.separateSettings;
    const files = e.target.files
    const url = await handleUploadFile(files[0], user_id)
    if (files.length === 0) return
    if (files[0].type === 'image/gif') return toast.error('表紙の画像形成が正しくありません。静止画を使ってください。')
    setLoadingImg(true)

    // for chapter handle
    if (forType === 'chapter') {
      if (_separate) {
        _separate.thumbnail = url;
      }
      newState.separateSettings = _separate;
      setState(newState);
      setLoadingImg(false)
      return;
    }

    /// for content handle
    if (separate?.id === 'create' || !separate?.id) {
      if (_separate) {
        _separate.thumbnail = url;
      }
      newState.separateSettings = _separate;
      setState(newState);
      setLoadingImg(false)
    } else {
      try {
        await updateContent({
          ...separate,
          separateSettings: {
            ...separate.separateSettings,
            thumbnail: url,
          }
        })
        toast.success("別サムネイルを更新しました。", {autoClose: 3000})
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingImg(false)
      }
    }
  }
  const handleDeleteImage = async () => {
    const newState = cloneDeep(state);
    const _separate = newState.separateSettings;

    if (_separate) {
      _separate.thumbnail = '';
    }

    newState.separateSettings = _separate;
    setState(newState);

    if (forType === 'content') {
      setSeparate({...separate, separateSettings: {...separate?.separateSettings, thumbnail: ''}})
      try {
        await updateContent({
          ...separate,
          separateSettings: {
            ...separate.separateSettings,
            thumbnail: '',
          }
        })
        toast.success("別サムネイルを削除しました。", {autoClose: 3000})
      } catch (e) {
        console.log(e)
      } finally {
        setOpen(false)
      }
    }
  }

  const onOpenModal = (e) => {
    e.preventDefault()
    setOpen(true)
  }
  return (
    <div className={'bg-white p-3 rounded-md max-h-fit overflow-auto text-xs mt-2 text-black'}>
      <div className={'grid grid-cols-12 text-center justify-items-start gap-2 py-1'}>
        <span className={'col-span-3 my-auto items-start flex'}>別サムネル</span>
        <Button
          color="primary"
          aria-label="upload picture"
          component="label"
          className={'relative group/item col-span-9 flex items-start'}
        >
          {
            (separate?.separateSettings?.thumbnail || state?.separateSettings?.thumbnail) &&
            <div
              className={"absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer opacity-0 group-hover/item:opacity-100"}>
              <img onClick={(e) => onOpenModal(e)}
                   width={20}
                   height={20}
                   src={'/images/scenario-template/deleteIcon.svg'} alt={'delete'}
                   className={'m-auto cursor-pointer'}/>
            </div>
          }
          <input hidden accept={'image/*'} type="file" onChange={onChangeThumbnail}/>
          {loadingImg ? <CircularProgress/> :
            <img
              className={`${separate?.separateSettings?.thumbnail ? '' : 'border border-solid border-gray-100  p-1'} rounded-sm w-[50px] h-[50px]`}
              src={separate?.separateSettings?.thumbnail || state?.separateSettings?.thumbnail ?
                (separate?.separateSettings?.thumbnail ?? state?.separateSettings?.thumbnail) : '/icons/no-image-frees.png'}
              alt='add-image-icon'/>
          }
        </Button>
      </div>
      {
        (forType === 'content' ? listSeparateContent : listSeparateChapter).map((item, index) => {
            return (
              <div className={'grid grid-cols-12 text-center gap-2 py-1'} key={item.type + index}>
                <span className={'col-span-3 my-auto items-start flex'}>{item.title}</span>
                <CssTextField
                  key={item.type}
                  onBlur={(e) => onBlurSeparate(e, item.type)}
                  className={'col-span-9'}
                  size={'small'}
                  value={state?.separateSettings?.[item.type] || separate?.separateSettings?.[item.type] || ''}
                  placeholder={`${item.title}入力`}
                  variant={'outlined'}
                  onChange={(e) => onChangeSeparate(e, item.type)}
                />
              </div>
            )
          }
        )
      }
      {
        <Modal open={open}
               size={'xs'}
               setOpen={setOpen}
               title={'別サムネイルを削除しますか？'}
               dividers={false}
               onClose={() => setOpen(false)}
               onSubmit={() => handleDeleteImage()}
               btnSubmit={'削除'}>
          <div/>
        </Modal>
      }
    </div>
  );
}

export default SeparateCustom;
