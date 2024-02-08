import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {eneColorRankImgSettingsRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {SaveSetting} from "@/app/types/block";

export const useGetEnecolorRankImgSettings = () => {
    const [eneColorRankImgSettings, setEneColorRankImgSettings] = useState<SaveSetting[]>([])
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const _eneColorRankImgSettingsRef = userId && eneColorRankImgSettingsRef(userId)
  const [values, loading, error] = useCollection(_eneColorRankImgSettingsRef)
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setEneColorRankImgSettings(null);
      const _eneColorSettings: SaveSetting[] = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        } as SaveSetting
      }
    )
    setEneColorRankImgSettings(_eneColorSettings.sort((a, b) => a.title.localeCompare(b.title, undefined, {numeric: true})))
  }, [values, error, loading, userId])

  return {eneColorRankImgSettings, loading, error};
}
