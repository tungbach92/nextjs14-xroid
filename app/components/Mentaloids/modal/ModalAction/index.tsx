import React, {useEffect, useState} from 'react';
import DialogCustom from "@/app/components/DialogCustom";
import {TextField} from "@mui/material";
import Action from "@/app/components/Mentaloids/modal/ModalAction/Action";
import {toast} from "react-toastify";
import {
  createCharacterMotion,
  createCharacterPoses,
  updateCharacterMotion,
  updateCharacterPose
} from "@/app/common/commonApis/characterVoiceSetting";
import {Character, Motion, Pose} from "@/app/types/types";
import {isFunction, isNil} from "lodash";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectChar: Character,
  isMotion?: boolean
  isPose?: boolean
  editMotion?: Motion,
  editPose?: Pose,
  setEditMotion?: React.Dispatch<React.SetStateAction<Motion>>
  setEditPose?: React.Dispatch<React.SetStateAction<Pose>>
}

function ModalAction({
  open,
  setOpen,
  selectChar,
  isPose = false,
  isMotion = false,
  editMotion,
  editPose,
  setEditPose,
  setEditMotion
}: Props) {
  const [url, setUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (isNil(editMotion) && isNil(editPose)) return
    setTitle(editPose?.name ?? editMotion.name ?? '')
    setUrl(editPose?.url ?? editMotion.url ?? '')
  }, [editPose, editMotion])
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const data = {name: title, url: url}
      if (isMotion) {
        if (isNil(editMotion)) {
          await createCharacterMotion(selectChar?.id, data)
          toast.success('モーションを追加しました。')
        } else {
          await updateCharacterMotion(selectChar?.id, {...data, id: editMotion.id})
          toast.success('編集できました。')
        }
      }

      if (isPose) {
        if (isNil(editPose)) {
          await createCharacterPoses(selectChar?.id, data)
          toast.success('ポーズを追加しました。')
        } else {
          await updateCharacterPose(selectChar?.id, {...data, id: editPose.id})
          toast.success('編集できました。')
        }
      }

      setOpen(false)
      setUrl('')
      setTitle('')
      isFunction(setEditMotion) && setEditMotion(null)
      isFunction(setEditPose) && setEditPose(null)
    } catch (e) {
      isMotion && toast.error('モーションが追加できませんでした。')
      isPose && toast.error('ポーズが追加できませんでした。')
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <DialogCustom
        title='モーション追加'
        open={open}
        setOpen={setOpen}
        action={false}
        onClose={() => {
          setOpen(false)
          setUrl('')
          setTitle('')
          isFunction(setEditMotion) && setEditMotion(null)
          isFunction(setEditPose) && setEditPose(null)
        }}
      >
        <div className='flex flex-col items-center w-full px-8 py-4'>
          <TextField
            className='w-full'
            size='small'
            placeholder='名前'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className='flex justify-center items-center w-full mt-4'>
            {
              isPose && <Action
                    title='画像'
                    icon='/icons/add-image-icon.svg'
                    image={url}
                    setImage={setUrl}
                    isPose={isPose}
                    accept={`image/png, image/jpg, image/jpeg`}
              />}
            {
              isMotion &&
              <Action
                  title='GIFアニメーション'
                  icon='/icons/add-animation-icon.svg'
                  image={url}
                  setImage={setUrl}
                  accept={`image/gif`}
              />}
          </div>
          <LoadingButton
            loading={loading}
            disabled={title.trim().length === 0 || !url}
            className='bg-[#39C23E] mt-6'
            variant='contained'
            onClick={handleSubmit}
          >
            保存
          </LoadingButton>
        </div>
      </DialogCustom>
    </div>
  );
}

export default ModalAction;
