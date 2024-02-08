import {useEffect} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {orderBy} from "lodash";
import {adminPopupRef} from "@/app/common/firebase/dbRefs";
import {usePopup} from "@/app/store/atom/popups.atom";
import {PopupData} from "@/app/types/types";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";


export default function useAdminPopups() {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [, setPopupData] = usePopup();
  const [values, loading, error] = useCollection(adminPopupRef(userInfo?.user_id))
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setPopupData(null);
    const _adminPopups: PopupData[] = values.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
    const sortAdminPopups = orderBy(_adminPopups, ["index"], ["desc"])
    setPopupData(sortAdminPopups)
  }, [values, error, loading])
}
