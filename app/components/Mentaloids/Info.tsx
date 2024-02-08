import {Avatar} from "@/app/components/Mentaloids/base/Avatar";
import {TextField} from "@/app/components/Mentaloids/base/TextField";
import React, {useEffect, useState} from "react";
import {Character} from "@/app/types/types";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CharacterModal from "@/app/components/Mentaloids/modal/CharacterModal";
import Image from "next/image";
import {createCharacter, deleteCharacter, updateCharacter} from "@/app/common/commonApis/characterVoiceSetting";
import {toast} from "react-toastify";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import DialogCustom from "@/app/components/DialogCustom";
import PlayVoiceButton from "@/app/components/custom/chapter/PlayVoiceButton";
import {CF_EMAIL, ENA_AND_RABBIT_ID, OWNER_ID} from "../../../common/ownerId";
import Textarea from '@mui/joy/Textarea';
import RenderCharacter from "@/app/components/Mentaloids/base/RenderCharacter";
import Modal from "@/app/components/custom/Modal";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";
import {ModalConfirmDelete} from "@/app/components/Mentaloids/modal/ModalConfirmDetele";

export interface InfoProps {
  characters: Character[]
  selectedChar: Character
  setSelectedChar: React.Dispatch<React.SetStateAction<Character>>
  audio: HTMLAudioElement
  setAudio: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disableSound: boolean
}

export default function Info({
                               characters,
                               selectedChar,
                               setSelectedChar,
                               audio,
                               setAudio,
                               disableSound
                             }: InfoProps) {

  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [isOpen, setIsOpen] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [characterItem, setCharacterItem] = useState<Character>(null)
  const [characterName, setCharacterName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [changeImage, setChangeImage] = useState(false)
  const [testVoice, setTestVoice] = useState('')
  const [contextPrompt1, setContextPrompt1] = useState('')
  const [contextPrompt2, setContextPrompt2] = useState('')
  const [dialogTitle, setDialogTitle] = useState('キャラクターの追加')
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  const superAdmin = userInfo?.user_id === OWNER_ID || (userInfo?.email?.includes(CF_EMAIL) && !isProd)
  const canNotEdit = userInfo?.user_id !== OWNER_ID && selectedChar?.isSystem && ENA_AND_RABBIT_ID.includes(selectedChar?.id)
    || selectedChar?.isTemplate && userInfo?.user_id !== OWNER_ID
  const [copyCharacterId, setCopyCharacterId] = useState<string>('')
  const [openDialogCopy, setOpenDialogCopy] = useState<boolean>(false)
  const {defaultVoice} = useDefaultVoice(selectedChar?.id)
  const handleUploadImage = async (e) => {
    if (e.target?.files?.length === 0) return
    setLoading(true)
    const url = await handleUploadFile(e.target?.files?.[0], userInfo?.user_id)
    setAvatar(url)
    setLoading(false)
    setChangeImage(false)
  }
  const handleClick = (id) => {
    const _allCharacter = [...characters]
    const selected = _allCharacter?.find(c => c.id === id)
    setSelectedChar(selected)
  }

  const handleChangeName = (e) => {
    setCharacterName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    setCharacterName(selectedChar?.name ?? '')
    setDescription(selectedChar?.description ?? '')
    setAvatar(selectedChar?.avatar ?? '')
    setContextPrompt1(selectedChar?.characterPrompt1 ?? '')
    setContextPrompt2(selectedChar?.characterPrompt2 ?? '')
  }, [selectedChar]);

  const handleUpdateCharacter = async () => {
    try {
      await updateCharacter({
        ...selectedChar,
        id: selectedChar?.id,
        name: characterName,
        description,
        avatar,
        characterPrompt1: contextPrompt1,
        characterPrompt2: contextPrompt2,
      })
      toast.success('キャラクターを編集しました。')
    } catch (e) {
      toast.error('キャラクターが編集できませんでした。')
    }
  }

  const handleDeleteCharacter = async () => {
    try {
      await deleteCharacter(characterItem.id)
      toast.success('キャラクターを削除しました。')
      setIsDelete(false)
    } catch (e) {
      setIsDelete(true)
      toast.error('キャラクターが削除できません。')
    }
  }

  const onChangeContextPrompt = (e, type: string) => {
    if (type === 'contextPrompt1') {
      setContextPrompt1(e.target.value)
    } else {
      setContextPrompt2(e.target.value)
    }
  }

  const onCopyDefaultCharacter = async () => {
    const copiedCharacter = characters?.find(c => c.id === copyCharacterId)
    const _copiedCharacter = {
      avatar: copiedCharacter?.avatar,
      description: copiedCharacter?.description,
      name: copiedCharacter?.name + '(コピー)',
      characterPrompt1: copiedCharacter?.characterPrompt1,
      characterPrompt2: copiedCharacter?.characterPrompt2,
      isTemplate: false,
      cloneByTemplateId: copyCharacterId,
    }
    try {
      await createCharacter({
        ..._copiedCharacter
      })
      toast.success('キャラクターをコピーしました。')
    } catch (e) {
      console.log(e);
      toast.error('キャラクターがコピーできません。')
    } finally {
      setOpenDialogCopy(false)
      setCopyCharacterId('')
    }
  }
  const isSuperAdmin = userInfo?.user_id === OWNER_ID
  const isTemplate = selectedChar?.isTemplate
  return <div className={`bg-white p-6`}>
    <div className={`grid grid-cols-12`}>
      <div className={`flex flex-col justify-center laptop:justify-start gap-3 mb-10 py-8 px-2 col-span-6`}>
        <RenderCharacter characters={characters?.filter(c => c?.userId)}
                         btnAddClassName={'m-auto'}
                         onDeleteCharacter={(id) => {
                           setIsDelete(true)
                           setCharacterItem(characters?.find(c => c.id === id))
                         }}
                         isSuperAdmin={superAdmin}
                         rowTittle={'ロイド'}
                         onSelectedCharacter={(id) => handleClick(id)}
                         selectedChar={selectedChar}
                         onOpenModal={() => {
                           setIsOpen(true)
                           setDialogTitle('キャラクターの追加')
                         }}
        />

        <RenderCharacter characters={characters?.filter(c => c?.isTemplate)}
                         onClickCopy={(id) => {
                           setCopyCharacterId(id)
                           setOpenDialogCopy(true)
                         }}
                         btnAddClassName={'m-auto'}
                         rowTittle={'デフォルト'}
                         isSuperAdmin={superAdmin}
                         onSelectedCharacter={(id) => handleClick(id)}
                         selectedChar={selectedChar}
                         onOpenModal={() => {
                           setIsOpen(true)
                           setDialogTitle('デフォルトのキャラクターの追加')
                         }}
        />
      </div>
      <div className={'col-span-5 flex flex-col justify-items-center'}>
        <div className={'mx-auto text-black -mt-3'}>
          キャラクター固定プロンプト
        </div>

        <div className={'flex items-center ml-4 pt-3'}>
          <span className={'text-black'}>文頭</span>
          <div className={'flex-1 pl-2'}>
            <Textarea
              disabled={!isSuperAdmin && isTemplate}
              onChange={(e) => onChangeContextPrompt(e, 'contextPrompt1')}
              value={contextPrompt1}
              maxRows={2}
              minRows={2}
              name="Warning"
              placeholder="入力してください。"
              variant="outlined"
              color="warning"
              sx={{width: '92%', backgroundColor: '#F7D668'}}
            />
          </div>
        </div>

        <div className={'flex items-center ml-4 pt-3'}>
          <span className={'text-black'}>文末</span>
          <div className={'flex-1 pl-2'}>
            <Textarea
              disabled={!isSuperAdmin && isTemplate}
              onChange={(e) => onChangeContextPrompt(e, 'contextPrompt2')}
              value={contextPrompt2}
              maxRows={2}
              minRows={2}
              name="Warning"
              placeholder="入力してください。"
              variant="outlined"
              color="warning"
              sx={{width: '92%', backgroundColor: '#F7D668'}}
            />
          </div>
        </div>

      </div>
      <div className={'col-span-1'}>
        <Button
          className="capitalize  font-bold mb-6 self-start"
          variant="contained"
          endIcon={<SaveIcon/>}
          onClick={handleUpdateCharacter}
          disabled={canNotEdit}>
          保存
        </Button>
      </div>
    </div>
    <div className={`flex flex-col gap-12 items-center laptop:flex-row`}>
      <div className={`flex flex-col gap-3 flex-1`}>
        <div className={`flex flex-col`}>
          <label className={'text-black'}>名前</label>
          <TextField
            disabled={!isSuperAdmin && isTemplate}
            value={characterName}
            onChange={(e) => handleChangeName(e)}
          />
        </div>
        <div className={`flex flex-col`}>
          <label className={'text-black'}>説明</label>
          <TextField
            disabled={!isSuperAdmin && isTemplate}
            value={description}
            onChange={(e) => handleChangeDescription(e)}
          />
        </div>
      </div>
      {selectedChar?.avatar && selectedChar?.avatar !== "" ?
        <Avatar
          onClick={() => {
            `${canNotEdit ? {} : setChangeImage(true)}`
          }}
          src={avatar ?? selectedChar?.avatar} alt={"avatar_Mentoroido"}
          className={'min-w-[100px] min-h-[100px] hover:scale-100 self-center'}
          isBorder={true}
        /> :
        <Avatar alt={"avatar_Mentoroido"}/>
      }
      <div className={`relative m-auto laptop:m-0 laptop:flex-1`}>
        <label className={'text-black'}>テスト文章</label>
        <TextField
          disabled={!isSuperAdmin && isTemplate}
          defaultValue={'これは私の声です。'}
          minRows={4}
          multiline
          onChange={(e) => setTestVoice(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          className={`bg-light-brown w-full px-6 mt-2`}
        />
        <div
          className={`absolute bottom-[48px] left-[-11px] border-l-0 border-r-[12px] border-r-light-brown border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-solid`}>
        </div>
        <div className='absolute right-8 top-1/2 -translate-y-1/2'>
          <PlayVoiceButton text={testVoice || 'これは私の声です。'}
                           voiceName={defaultVoice?.voiceName || 'Mayu'}
                           pitch={defaultVoice?.pitch || 100}
                           speed={defaultVoice?.speed || 100}
                           volume={defaultVoice?.volume || 100}
                           emotion={defaultVoice?.emotion || 'normal'}
                           emotion_level={defaultVoice?.emotion_level || 2}
                           disabled={disableSound}
                           audio={audio}
                           setAudio={setAudio}/>
        </div>
      </div>
      <div className={'h-[118px] w-[118px]'}>
        {/*<img*/}
        {/*  src="/images/mentaloids/enecolor.png"*/}
        {/*  alt={'enecolor'}*/}
        {/*  className={`laptop:h-[118px] w-[118px] self-center  aspect-square cursor-pointer`}*/}
        {/*/>*/}
      </div>

    </div>
    <CharacterModal
      open={isOpen}
      setOpen={setIsOpen}
      dialogTitle={dialogTitle}
      userId={userInfo?.user_id}
    />
    <DialogCustom open={changeImage} setOpen={setChangeImage} onClick={handleUploadImage} title='キャラクターの画像変更'>
      <Button
        color="primary"
        aria-label="upload picture"
        component="label"
      >
        {
          loading ?
            <CircularProgress/>
            :
            <Image
              src={avatar ?? selectedChar?.avatar}
              alt='upload-icon'
              className='object-contain'
              width={300}
              height={150}
            />
        }
        <input
          id={`upload-image`}
          hidden
          accept="image/*"
          type="file"
          onChange={event => handleUploadImage(event)}
        />
      </Button>
    </DialogCustom>
    {isDelete &&
      <ModalConfirmDelete
        title={`${characterItem?.name}のキャラクターを削除しますか？`}
        id={characterItem?.id}
        openModal={isDelete}
        setOpenModal={setIsDelete}
        handleSubmit={handleDeleteCharacter}
      />}
    {
      openDialogCopy &&
      <Modal open={openDialogCopy}
             setOpen={setOpenDialogCopy}
             title={'このキャラクターをコピーする'}
             size={'xs'}
             onSubmit={() => onCopyDefaultCharacter()}
             handleClose={() => setOpenDialogCopy(false)}
             actionPosition={'center'}
             btnSubmit={'コピーする'}
      />
    }
  </div>
}
