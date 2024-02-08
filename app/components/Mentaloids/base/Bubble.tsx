import React, {ReactNode, SetStateAction} from "react";
import {twMerge} from "tailwind-merge";
import AudioPopup from "@/app/components/Mentaloids/AudioPopup";
import {Character, TextVoice} from "@/app/types/types";
import PlayVoiceButton from "@/app/components/custom/chapter/PlayVoiceButton";
import Image from "next/image";
import {isFunction} from "lodash";
import {iconImg} from "@/app/components/assets/image/icon";
import IconButton from "@mui/material/IconButton";

type Props = {
  children?: ReactNode;
  className?: string;
  classNameArrow?: string;
  textVoice?: TextVoice;
  selectedChar?: Character;
  setSelectedChar?: React.Dispatch<SetStateAction<Character>>;
  defaultTextVoice?: TextVoice;
  toggleOpenModal?: () => void;
  setVoices?: React.Dispatch<React.SetStateAction<any[]>>
  voiceDefault?: any
  setVoiceDefault?: React.Dispatch<React.SetStateAction<any>>
  isDefault?: boolean
  selectedVoiceId?: string
  setSelectedVoiceId?: React.Dispatch<React.SetStateAction<string>>
  voiceId?: string
  isCircle?: boolean
  isInChapters?: boolean
  audio?: HTMLAudioElement
  setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disabled?: boolean
};

export default function Bubble({
                                 children,
                                 className = "",
                                 classNameArrow = "",
                                 textVoice,
                                 selectedChar,
                                 setSelectedChar,
                                 toggleOpenModal,
                                 setVoices,
                                 voiceDefault,
                                 setVoiceDefault,
                                 isDefault = false,
                                 selectedVoiceId,
                                 setSelectedVoiceId,
                                 voiceId,
                                 isCircle = false,
                                 isInChapters = false,
                                 audio,
                                 setAudio,
                                 disabled = false
                               }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleSelectVoice = () => {
    isFunction(setSelectedVoiceId) && setSelectedVoiceId(voiceId)
  }
  return (
    <div>
      <div
        className={twMerge(
          `group flex gap-6 items-center justify-center border-solid border-2 rounded-xl
           ${isDefault ? 'border-blue-500' : 'border-gray-300'}   w-[160px] h-[43px] p-2 bg-light-gray relative hover:scale-105`,
          className
        )}
        onClick={handleSelectVoice}
      >
        {
          selectedVoiceId === voiceId && isCircle &&
          < img src={iconImg.checkedCircle} alt={'checked-circle'} className={'absolute top-[-12px] right-[-12px]'}/>
        }
        <div
          className={twMerge(
            `absolute bottom-[-31%] left-[14%] border-l-0 border-b-0 border-r-[12px] border-r-transparent border-t-[12px]
            ${isDefault ? 'border-t-blue-500' : 'border-t-gray-300'} border-solid`,
            classNameArrow
          )}
        ></div>
        {children ? (
          children
        ) : (
          <>
            <div className={`group-hover:text-shade-blue truncate`}>{textVoice?.displayName || "通常"}</div>
            <PlayVoiceButton text={textVoice?.txtText || textVoice?.txtTest}
                             voiceName={textVoice?.voiceName}
                             speed={textVoice?.speed}
                             pitch={textVoice?.pitch}
                             volume={textVoice?.volume}
                             emotion={textVoice?.emotion}
                             emotion_level={textVoice?.emotion_level}
                             audio={audio}
                             setAudio={setAudio}
                             disabled={disabled}
            />
            {
              // isDefault &&
              !isInChapters &&
              <IconButton
                onClick={(e) => {
                  if (textVoice) setAnchorEl(e.currentTarget);
                  else setAnchorEl(null);
                }}>
                <Image
                  className=''
                  src='/icons/3dot.svg'
                  alt=''
                  width={10}
                  height={16}
                />
              </IconButton>


            }
          </>
        )}
      </div>
      <AudioPopup
        isDefault={isDefault}
        toggleOpenModal={toggleOpenModal}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        textVoice={textVoice}
        selectedChar={selectedChar}
        setSelectedChar={setSelectedChar}
        voiceDefault={voiceDefault}
        setVoiceDefault={setVoiceDefault}
      />
    </div>
  );
}
