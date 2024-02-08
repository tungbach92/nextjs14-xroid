import {useEffect} from "react";
import {useBanner} from "@/app/store/atom/banners.atom";
import {useCollection} from "react-firebase-hooks/firestore";
import {adminBannerRef} from "@/app/common/firebase/dbRefs";
import {orderBy} from "lodash";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {BannerData} from "@/app/types/types";


export default function useAdminBanners() {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [, setBannerData] = useBanner();
  const [values, loading, error] = useCollection(adminBannerRef(userInfo?.user_id))
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setBannerData(null);
    const _adminBanners: BannerData[] = values.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
    const sortAdminBanners = orderBy(_adminBanners, ["index"], ["desc"])
    setBannerData(sortAdminBanners)
  }, [values, error, loading])
}
