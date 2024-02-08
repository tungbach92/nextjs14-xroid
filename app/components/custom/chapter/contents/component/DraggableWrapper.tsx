import {type DraggableProvided} from "react-beautiful-dnd";
import MotionAndVoiceComponent from "@/app/components/custom/chapter/MotionAndVoiceComponent";
import React, {useMemo, useState} from "react";
import {cloneDeep, isArray, isFunction} from "lodash";
import {useAtom, useSetAtom} from "jotai";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {ListMotionPose} from "@/app/components/Mentaloids/ListMotionPose";
import {ModalListMotionPose} from "@/app/components/Mentaloids/modal/ModalListMotionPose";
import {useMotionPose} from "@/app/hooks/useMotionPose";
import Modal from "@/app/components/custom/Modal";
import Bubble from "@/app/components/Mentaloids/base/Bubble";
import {useVoices} from "@/app/hooks/useVoices";
import {useModal} from "@/app/hooks/useModal";
import {AudioModal} from "@/app/components/Mentaloids/modal";
import {TYPE_TEXT_BLOCK} from "@/app/configs/constants";
import {Block} from "@/app/types/block";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {CircularProgress} from "@mui/material";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";

interface Props {
  block: Block
  index: number
  provided: DraggableProvided
  style: Object
  handleItemSelection: (id: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children: React.ReactNode
  isHistory?: boolean
}

export const DraggableWrapper = ({
  block,
  index,
  provided,
  style,
  handleItemSelection,
  children,
  isHistory
}: Props) => {
  const [openModalMotion, setOpenModalMotion] = useState(false)
  const [openModalVoice, setOpenModalVoice] = useState(false)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [selectedMotionId, setSelectedMotionId] = useState<string>('')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [selectedCharId, setSelectedCharId] = useState<string>('')
  const {poses, motions, loading} = useMotionPose(selectedCharId)
  const {voices, loadingVoice} = useVoices(selectedCharId)
  const {isOpenModal, toggleOpenModal} = useModal();
  const selectedChar = useMemo(() => block?.characters?.find(c => c.id === selectedCharId), [block?.characters, selectedCharId])
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [audio, setAudio] = useState(new Audio())
  const [disableSound,] = useAtom(disableSoundAtom)

  const handleClickMotion = (charId: string) => {
    setOpenModalMotion(true)
    const char = block?.characters?.find(c => c.id === charId)
    setSelectedMotionId(char?.motionId ?? '')
    setSelectedCharId(charId)
  }
  const handleSelectMotion = (id: string) => {
    setSelectedMotionId(id)
  }


  const handleClickVoice = (charId: string) => {
    setOpenModalVoice(true)
    const char = block?.characters?.find(c => c.id === charId)
    setSelectedVoiceId(char?.voiceId ?? '')
    setSelectedCharId(charId)
  }
  const handleSaveMotion = () => {
    // setMotionUrl(selectedMotionUrl)
    const _characters = cloneDeep(block?.characters)
    const idx = _characters.findIndex((c) => c.id === selectedCharId)
    _characters[idx].motionId = selectedMotionId

    const _blocks = cloneDeep(blocks)
    _blocks[index].characters = [..._characters]
    setBlocks(_blocks)

    setOpenModalMotion(false)
    setSelectedCharId('')
    setSelectedMotionId('')
  }


  const handleSaveVoice = () => {
    const _characters = cloneDeep(block?.characters)
    const idx = _characters.findIndex((c) => c.id === selectedCharId)
    _characters[idx].voiceId = selectedVoiceId

    const _blocks = cloneDeep(blocks)
    _blocks[index].characters = [..._characters]
    setBlocks(_blocks)

    setOpenModalVoice(false)
    setSelectedCharId('')
    setSelectedVoiceId('')
  }
  const handleClickAvatar = (charId: string) => {
    setIsVoiceCharacter({updateBlocks, block, charId})
  }
  return (
    <div {...provided.draggableProps}
         {...provided.dragHandleProps}
         className={`group ${isHistory ? 'pointer-events-none' : ''}`}
         ref={provided.innerRef}
         style={style}
         onMouseDown={e => e.currentTarget.focus({preventScroll: true})}
         onClick={(event) => handleItemSelection(block?.id, event)}
    >
      <div className={"flex gap-1"}>
        {/*<div className={"flex gap-1"}>*/}
        {/*  <div*/}
        {/*    className={*/}
        {/*      `flex items-center justify-center border-[2px] border-t-0 border-b-0 border-solid border-[#E1E9F2] h-full p-1 w-[76px] cursor-pointer*/}
        {/*      ${index === (length - 1) && 'border-b-[2px] rounded-b-md'}*/}
        {/*      ${index === 0 && 'border-t-[2px] rounded-t-md'}*/}
        {/*      ${isHoverAudio && '!border-r-darkBlue !border-l-darkBlue'}*/}
        {/*      ${isHoverAudio && index === 0 && '!border-r-darkBlue !border-l-darkBlue !border-t-darkBlue'}*/}
        {/*      ${isHoverAudio && index === (length - 1) && '!border-r-darkBlue !border-l-darkBlue !border-b-darkBlue'}*/}
        {/*      ${isTimeLineMusicColor(arraySameMusic, index) ? `!border-lightBlue` : ''}*/}
        {/*      ${isBorderTopMusic(blocks, index) ? `border-t-[2px] rounded-t-md !border-lightBlue` : ''}*/}
        {/*      ${isBorderBottomMusic(blocks, index) ? `border-b-[2px] rounded-b-md !border-lightBlue` : ''}*/}
        {/*      ${index === length - 1 && blocks[index - 1]?.audioUrl !== blocks[index]?.audioUrl && blocks[index]?.audioUrl && !isTimeLineMusicColor(arraySameMusic, index) ? `border-t-[2px] !border-t-lightBlue rounded-t-md !border-lightBlue` : ''}*/}
        {/*      ${index === 0 && blocks[index + 1]?.audioUrl !== blocks[index]?.audioUrl && blocks[index]?.audioUrl && !isTimeLineMusicColor(arraySameMusic, index) ? `border-b-[2px] !border-b-lightBlue rounded-b-md !border-lightBlue` : ''}*/}
        {/*      `}*/}
        {/*    onClick={() => handleOpenAudioSetting("music")}*/}
        {/*    onMouseOver={() => setIsHoverAudio(true)}*/}
        {/*    onMouseLeave={() => setIsHoverAudio(false)}*/}
        {/*  >*/}
        {/*    /!*<label htmlFor={`audio-input-chat ${item.id}`}>*!/*/}
        {/*    <div*/}
        {/*      className={`flex flex-col items-center ${!item.audioUrl && 'hidden'} ${isHiddenMusic(blocks, index) && 'hidden'}`}>*/}
        {/*      <div className='w-[64px] line-clamp-2 text-sm'>{blocks[index].audioName}</div>*/}
        {/*      <img*/}
        {/*        className={`w-16 h-16 object-contain `}*/}
        {/*        src={item?.previewAudioUrl || "/images/scenario-template/music.svg"}*/}
        {/*        alt={"music"}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div*/}
        {/*    className={`image-upload flex items-center justify-center border-[2px] border-t-0 border-b-0 border-solid border-[#E1E9F2] h-full p-1 w-[76px] cursor-pointer*/}
        {/*    ${index === (length - 1) ? 'border-b-[2px] rounded-b-md' : ''}*/}
        {/*    ${index === 0 ? 'border-t-[2px] rounded-t-md' : ''}*/}
        {/*    ${isHoverImage ? '!border-r-darkBlue !border-l-darkBlue' : ''}*/}
        {/*    ${isHoverImage && index === 0 ? '!border-r-darkBlue !border-l-darkBlue !border-t-darkBlue' : ''}*/}
        {/*    ${isHoverImage && index === (length - 1) ? '!border-r-darkBlue !border-l-darkBlue !border-b-darkBlue' : ''}*/}
        {/*    ${isTimeLineImageColor(arraySameImage, index) ? `!border-lightBlue` : ''}*/}
        {/*    ${isBorderTopImg(blocks, index) ? `border-t-[2px] rounded-t-md !border-lightBlue` : ''}*/}
        {/*    ${isBorderBottomImg(blocks, index) ? `border-b-[2px] rounded-b-md !border-lightBlue` : ''}*/}
        {/*    ${index === length - 1 && blocks[index - 1]?.imageUrl !== blocks[index]?.imageUrl && blocks[index]?.imageUrl && !isTimeLineImageColor(arraySameImage, index) ? `border-t-[2px] !border-t-lightBlue rounded-t-md !border-lightBlue` : ''}*/}
        {/*    ${index === 0 && blocks[index + 1]?.imageUrl !== blocks[index]?.imageUrl && blocks[index]?.imageUrl && !isTimeLineImageColor(arraySameImage, index) ? `border-b-[2px] !border-b-lightBlue rounded-b-md !border-lightBlue` : ''}*/}
        {/*    `}*/}
        {/*    onClick={() => handleOpenAudioSetting("image")}*/}
        {/*    onMouseOver={() => setIsHoverImage(true)}*/}
        {/*    onMouseLeave={() => setIsHoverImage(false)}>*/}
        {/*    /!*<label htmlFor={`file-input-chat ${item.id}`}>*!/*/}
        {/*    <img*/}
        {/*      className={`h-16 w-16 object-contain ${!item?.imageUrl && 'hidden'} ${isHiddenImage(blocks, index) && 'hidden'}`}*/}
        {/*      src={item?.imageUrl || "/images/scenario-template/addImage.svg"}*/}
        {/*      alt={"image"}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        {children}
        {isArray(block?.characters) ? block?.characters?.map((char, index) => {
            if (!char?.isShow || block?.type === 'control') return null;
            if (char?.isShow && char?.isAction && TYPE_TEXT_BLOCK.includes(block?.type) || char?.isVoice && TYPE_TEXT_BLOCK.includes(block.type))
              return (
                <MotionAndVoiceComponent key={'action_character_' + index + char?.id}
                                         char={char}
                                         handleClickMotion={handleClickMotion}
                                         handleClickBubble={handleClickVoice}
                                         handleClickAvatar={handleClickAvatar}
                                         block={block} setSelectedVoiceId={setSelectedVoiceId}
                                         selectedVoiceId={selectedVoiceId}
                />
              );
          })
          : null}
      </div>
      <ModalListMotionPose setSelectedCharId={setSelectedCharId} openModal={openModalMotion}
                           setOpenModal={setOpenModalMotion}
                           setSelectedMotionId={setSelectedMotionId} selectedMotionId={selectedMotionId}
                           handleSubmit={handleSaveMotion}>
        <ListMotionPose handleSelectMotion={handleSelectMotion}
                        selectedMotionId={selectedMotionId} poses={poses} motions={motions} loading={loading}/>
      </ModalListMotionPose>
      <Modal
        open={openModalVoice}
        setOpen={setOpenModalVoice}
        title={'ヴォイス'}
        onClose={() => {
          setOpenModalVoice(false)
          isFunction(setSelectedCharId) && setSelectedCharId('')
          isFunction(setSelectedVoiceId) && setSelectedVoiceId('')
        }}
        onSubmit={handleSaveVoice}
        titlePosition={'center'}
        actionPosition={'center'}
        handleClose={() => {
          setOpenModalVoice(false)
          isFunction(setSelectedCharId) && setSelectedCharId('')
          isFunction(setSelectedVoiceId) && setSelectedVoiceId('')
        }}
        // isDisabled={!Boolean(selectedMotionId)}
      >
        {!loadingVoice ?
          <div className={`flex flex-wrap overflow-y-auto gap-6 p-6 justify-start`}>
            {voices?.map((voice, index) => (
              <Bubble
                toggleOpenModal={toggleOpenModal}
                key={index}
                textVoice={voice}
                selectedChar={selectedChar}
                selectedVoiceId={selectedVoiceId}
                setSelectedVoiceId={setSelectedVoiceId}
                voiceId={voice.id}
                className={`${selectedVoiceId === voice.id && 'border-shade-blue'}`}
                classNameArrow={`${selectedVoiceId === voice.id && 'border-t-shade-blue'}`}
                isCircle={true}
                isInChapters={true}
                audio={audio}
                setAudio={setAudio}
                disabled={disableSound}
              />
            ))}
          </div> : <div className={'w-full flex justify-center'}>
            <CircularProgress/>
          </div>
        }
      </Modal>
      <AudioModal
        isOpen={isOpenModal}
        handleClose={toggleOpenModal}
        selectedChar={selectedChar}
      />
    </div>
  )
}
