import {Button} from "@/app/components/Mentaloids/base/Button";
import Bubble from "@/app/components/Mentaloids/base/Bubble";
import React, {SetStateAction, useState} from "react";
import {useModal} from "@/app/hooks/useModal";
import {AudioModal} from "@/app/components/Mentaloids/modal";
import {Character, Voice} from "@/app/types/types";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {ENA_AND_RABBIT_ID, OWNER_IDS} from "../../../common/ownerId";
import useGetCharacter from "@/app/hooks/useGetCharacter";
import useGetAllCharacterVoice from "@/app/hooks/useGetAllCharacterVoice";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";

export interface AudioProps {
  selectedChar: Character
  setSelectedChar: React.Dispatch<SetStateAction<Character>>
  voiceDefault?: any
  setVoiceDefault?: React.Dispatch<React.SetStateAction<any>>
}

function AudioRender({selectedChar, setSelectedChar, voiceDefault, setVoiceDefault}: AudioProps) {
  const [audio, setAudio] = useState(new Audio())
  const {isOpenModal, toggleOpenModal} = useModal();
  const [userInfo] = useAtom(userAtomWithStorage);
  const {allCharacterVoice} = useGetAllCharacterVoice(selectedChar?.id)
  const {character, setCharacter} = useGetCharacter(selectedChar?.id)
  const newVoices = allCharacterVoice?.find((t: Voice) => t?.id === character?.defaultVoice)
  const canNotEdit =  !OWNER_IDS.includes(userInfo?.user_id) && selectedChar?.isSystem && ENA_AND_RABBIT_ID.includes(selectedChar?.id) ||
    !OWNER_IDS.includes(userInfo?.user_id) && selectedChar?.isTemplate
  const [disableSound,] = useAtom(disableSoundAtom)

  return (
    <div className={`flex flex-col bg-white`}>
      <div
        className={`flex flex-wrap-reverse gap-12 border-b-2 w-full px-6 py-3 justify-center laptop:justify-start laptop:flex-wrap`}
      >
        <div className={`flex gap-3 items-center flex-col laptop:flex-row w-full laptop:w-auto`}>
          <div className={`min-w-fit`}>ヴォイス</div>
          <Button onClick={toggleOpenModal} disabled={canNotEdit}></Button>
        </div>
        <div className={`flex flex-wrap gap-3 items-center justify-center laptop:justify-start`}>
          <div className={`min-w-fit`}>デフォルトの声</div>
          <Bubble
            isInChapters={canNotEdit}
            toggleOpenModal={toggleOpenModal}
            textVoice={newVoices}
            selectedChar={selectedChar}
            setSelectedChar={setSelectedChar}
            voiceDefault={character}
            setVoiceDefault={setCharacter}
            isDefault={true}
            audio={audio}
            setAudio={setAudio}
            disabled={disableSound}
          />
        </div>
      </div>
      <div className={`flex laptop:flex-wrap overflow-x-auto gap-6 p-6 justify-center laptop:justify-start`}>
        {allCharacterVoice?.map((t, index) => (
          <Bubble
            isInChapters={canNotEdit}
            toggleOpenModal={toggleOpenModal}
            key={index}
            textVoice={t}
            selectedChar={selectedChar}
            setSelectedChar={setSelectedChar}
            voiceDefault={voiceDefault}
            setVoiceDefault={setVoiceDefault}
            isDefault={t?.isDefault}
            audio={audio}
            setAudio={setAudio}
            disabled={disableSound}
          />
        ))}
      </div>
      <AudioModal
        isOpen={isOpenModal}
        handleClose={toggleOpenModal}
        selectedChar={selectedChar}
        setSelectedChar={setSelectedChar}
      />
    </div>
  );
}

export default AudioRender;
