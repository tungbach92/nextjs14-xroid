import React, {useEffect, useState} from "react";
import Info from "@/app/components/Mentaloids/Info";
import AudioRender from "@/app/components/Mentaloids/Audio";
import Animation from "@/app/components/Mentaloids/Animation";
import {Character, TextVoice} from "@/app/types/types";
import {useCharacters} from "@/app/hooks/useCharacters";
import LinearProgress from "@mui/material/LinearProgress";
import {useAtom} from "jotai";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";

function Mentaloids() {
  const {characters, loading} = useCharacters()
  const [selectedChar, setSelectedChar] = useState<Character>(null)
  const [voiceDefault, setVoiceDefault] = useState<TextVoice>(undefined)
  const [disableSound,] = useAtom(disableSoundAtom)
  const [audio, setAudio] = useState(new Audio())
  useEffect(() => {
    if (loading) return;
    setSelectedChar(characters?.filter((item) => !item?.isURoidTemplate)?.at(-1))
  }, [characters?.length]);
  return (
    loading ?
      <LinearProgress/>
      :
      <div className={`flex flex-col gap-6 my-9 ml-6 mr-6 laptop:mr-24`}>
        <Info
          characters={characters?.filter((item) => !item?.isURoidTemplate)}
          selectedChar={selectedChar}
          setSelectedChar={setSelectedChar}
          audio={audio}
          setAudio={setAudio}
          disableSound={disableSound}
        />
        <AudioRender
          selectedChar={selectedChar}
          setSelectedChar={setSelectedChar}
          voiceDefault={voiceDefault}
          setVoiceDefault={setVoiceDefault}
        />
        <Animation selectedChar={selectedChar}/>
      </div>
  )
}

export default Mentaloids
