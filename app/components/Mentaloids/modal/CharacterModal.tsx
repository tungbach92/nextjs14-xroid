import DialogCustom from "@/app/components/DialogCustom";
import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import {toast} from "react-toastify";
import {createCharacter} from "@/app/common/commonApis/characterVoiceSetting";

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  userId: string,
  dialogTitle?: string,
}

const CharacterModal = ({
                          open,
                          setOpen,
                          userId,
                          dialogTitle
                        }: Props) => {
  const [characterName, setCharacterName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUploadImage = async (e) => {
    if (e.target.files.length === 0) return
    setLoading(true)
    const url = await handleUploadFile(e.target.files[0], userId)
    setAvatar(url)
    setLoading(false)
  }

  const handleChangeName = (e) => {
    setCharacterName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      toast.error('キャラクター名を入力してください。')
      return
    }
    if(!avatar) {
      toast.error('アバターをアップロードしてください。')
      return
    }
    try {
      if (dialogTitle === 'デフォルトのキャラクターの追加') {
        await createCharacter({
          name: characterName,
          description,
          avatar,
          isTemplate: true
        })
      } else await createCharacter({
        name: characterName,
        description,
        avatar
      })
      setOpen(false)
      setCharacterName('')
      setDescription('')
      setAvatar('')
      toast.success('キャラクターが追加しました。')
    } catch (e) {
      setOpen(true)
      toast.error('キャラクターが追加できません。')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setCharacterName('')
    setDescription('')
    setAvatar('')
  }

  return (
    <DialogCustom
      title={dialogTitle}
      open={open}
      setOpen={setOpen}
      onClick={handleCreateCharacter}
      onClose={handleClose}
    >
      <div className='flex flex-col gap-4 w-full px-8 py-4'>
        <TextField value={characterName} size='small' placeholder={'名前'} className=''
                   onChange={(e) => handleChangeName(e)}/>
        <TextField value={description} size='small' placeholder={'説明'} className=''
                   onChange={(e) => handleChangeDescription(e)}/>
        <Button
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          {
            loading ?
              <CircularProgress/>
              :
              <div className={'flex flex-col items-center'}>
                <Image
                  src={!avatar ? '/images/upload.svg' : avatar}
                  alt='upload-icon'
                  className='object-contain'
                  width={avatar ? 300 : 20}
                  height={avatar ? 150 : 20}
                />
                <span className='text-sm'>アップロード</span>
              </div>
          }
          <input
            id={`upload-image`}
            hidden
            accept="image/*"
            type="file"
            onChange={event => handleUploadImage(event)}
          />
        </Button>
      </div>
    </DialogCustom>
  )
}

export default CharacterModal
