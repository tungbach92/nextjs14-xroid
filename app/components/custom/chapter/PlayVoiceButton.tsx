import IconButton from "@mui/material/IconButton";
import {VolumeUp} from "@mui/icons-material";
import React, {SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import Loading from "@/app/components/custom/Loading";
import find from "lodash/find";
import get from "lodash/get";
import {useAtom} from "jotai";
import {toast} from "react-toastify";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";

const OptionSpeaker = [
  {
    value: "Mayu",
    label: "Mayu (女性)",
  },
  {
    value: "Hikari-DNN",
    label: "Hikari (女性)",
  },
  {
    value: "Risa-DNN",
    label: "Risa (女性)",
  },
  {
    value: "Yuina-DNN",
    label: "Yuina (女性)",
  },
  {
    value: "Takeru-DNN",
    label: "Takeru (男性)",
  },
  {
    value: "Show-DNN",
    label: "Show (男性)",
  },
  {
    value: "Akira-DNN",
    label: "Akira (男性)",
  },
  {
    value: "Tsuna",
    label: "Tsuna (キャラクター)",
  }
];


const getVoiceName = name => {
  switch (name) {
    case 'Rabbit':
    case 'Duck':
      return 'Tsuna'
    case 'Ena':
      return 'Mayu'
    case 'Hikari':
      return 'Hikari-DNN'
    case 'Risa':
      return 'Risa-DNN'
    case 'Yuina':
      return 'Yuina-DNN'
    case 'Takeru':
      return 'Takeru-DNN'
    case 'Show':
      return 'Show-DNN'
    case 'Akira':
      return 'Akira-DNN'
    case 'Robota':
      return 'Robota'
    default:
      return 'Mayu'
  }
}
const PlayVoiceButton = (
  {
    pitch,
    speed,
    volume,
    text,
    voiceName,
    onPlayDone,
    item,
    emotion,
    emotion_level,
    audio,
    setAudio,
    disabled,
    setTextVoiceErr
  }: {
    text: string,
    voiceName?: string,
    onPlayDone?: () => void,
    pitch?: number,
    speed?: number,
    volume?: number,
    item?: any,
    emotion?: string
    emotion_level?: number
    audio?: HTMLAudioElement
    setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
    disabled?: boolean
    setTextVoiceErr?: React.Dispatch<SetStateAction<boolean>>
  }) => {
  voiceName ??= getVoiceName(get(find(item?.characters, {isVoice: true}), 'name'))
  const [loading, setLoading] = useState(false)
  const [, disableSound] = useAtom(disableSoundAtom)
  const [reGetEmotion, setReGetEmotion] = useState('')

  useEffect(() => {
    if (!emotion) return
    if (emotion === 'normal') setReGetEmotion('')
    else setReGetEmotion(emotion)
  }, [emotion])

  useEffect(() => {
    disableSound(loading)
  }, [loading])

  useEffect(() => {
    audio?.addEventListener("ended", () => {
      onPlayDone?.()
    });
    return () => {
      audio?.removeEventListener("ended", () => {
      });
    };
  }, [audio, onPlayDone]);

  async function playSound() {
    if (!text && voiceName !== 'noVoice') {
      setTextVoiceErr?.(true)
      toast.error('未設定の必須項目があります。再度確認してください。')
      return
    }
    if(voiceName === 'noVoice') {
      toast.error('音声が設定されていません。')
      return
    }
    try {
      setLoading(true)
      const {data} = await axios.get(
        process.env.NEXT_PUBLIC_MENTOROID_API + `/v2/getMp3Url`,
        {
          params: {
            text,
            voiceName,
            speed,
            volume,
            pitch,
            emotion: reGetEmotion,
            emotion_level
          }
        })
      ;

      if (!data?.mp3url) {
        return;
      }
      const newAudio = new Audio(data.mp3url);
      setAudio(newAudio);
      await newAudio.play();
      await audio.pause();
      onPlayDone?.();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  }

  return (
    <IconButton
      aria-label="play voice"
      onClick={playSound}
      edge="end"
      disabled={disabled}
    >
      {loading ?
        <Loading/> :
        <VolumeUp/>
      }
    </IconButton>
  )
}

export default PlayVoiceButton;
