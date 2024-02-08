import {Voice} from "@/app/types/types";
import {useEffect, useState} from "react";
import {voiceColRef} from "@/app/common/firebase/dbRefs";
import {useCollection} from "react-firebase-hooks/firestore";

export default function useDefaultVoice(characterId: string) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [defaultVoice, setDefaultVoice] = useState<Voice | null>(null);
  const [value, loading, error] = useCollection(voiceColRef(characterId))
  useEffect(() => {
    if (error || loading || (!loading && !value))
      return setVoices([]);
    const _voices: Voice[] = value.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
    setVoices(_voices)
    if (!_voices.length || !characterId || characterId.includes('uRoidTemp_')) return setDefaultVoice(null)
    setDefaultVoice(_voices.find(voice => voice.isDefault))
  }, [value, error, loading])
  return {voices, setVoices, defaultVoice, setDefaultVoice}
}
