import {voicesColRef} from "@/app/common/firebase/dbRefs";
import {getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";

const useCharacterVoices = (id: string) => {
  const [voices, setVoices] = useState([])
  useEffect(() => {
    if (!id) return;
    getListVoice().then()
  }, [id]);

  const getListVoice = async () => {
    const querySnapshot = await getDocs(id && voicesColRef(id));
    let _voices = []
    querySnapshot.forEach((doc) => {
      _voices.push(doc.data())
    });
    setVoices(_voices)
  }
  return voices
}

export default useCharacterVoices;
