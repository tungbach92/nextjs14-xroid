import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {eneColorRankTextSettingsRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {SaveSetting} from "@/app/types/block";

export const useGetEnecolorRankTextSettings = () => {
  const [eneColorRankTextSettings, setEneColorRankTextSettings] = useState<SaveSetting[]>([])
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const _eneColorRankTextSettingsRef = userId && eneColorRankTextSettingsRef(userId)
  const [values, loading, error] = useCollection(_eneColorRankTextSettingsRef)
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setEneColorRankTextSettings(null);
    const _eneColorSettings = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        } as SaveSetting
      }
    )
    setEneColorRankTextSettings(_eneColorSettings.sort((a, b) => a.title.localeCompare(b.title, undefined, {numeric: true})))
  }, [values, error, loading, userId])

  return {eneColorRankTextSettings, loading, error};
}
