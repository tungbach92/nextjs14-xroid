import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {textSettingsRef} from "@/app/common/firebase/dbRefs";
import {useCollection} from "react-firebase-hooks/firestore";
import {SaveSetting} from "@/app/types/block";

export const useGetTextSetting = () => {
    const [textSettings, setTextSettings] = useState<SaveSetting[]>([])
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const _textSettingsRef = userId && textSettingsRef(userId)
  const [values, loading, error] = useCollection(_textSettingsRef)
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setTextSettings(null);
    const _textSettings = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        }
      }
    )
      // @ts-ignore
    setTextSettings(_textSettings)
  }, [values, error, loading, userId])

  return {textSettings, loading, error};
}
