import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {uRoidTemplatesRef, userRoidColRef} from "@/app/common/firebase/dbRefs";
import {orderBy} from "lodash";
import {Character} from "@/app/types/types";

function useGetUserRoidsByUserId(id: string) {
  const [userRoids, setUserRoids] = useState<Character[]>([]);
  const [value, loading, error] = useCollection(uRoidTemplatesRef(id));
  useEffect(() => {
    if (error || loading || (!loading && !value)) return setUserRoids(null);
    const _userRoids = value.docs.map((doc) => ({...doc.data(), id: doc.data().id}));
    const template: Character[] = _userRoids?.map((userRoid : Character) => {
        return {
          ...userRoid,
          id: userRoid.id,
          avatar:  userRoid?.avatar || '',
          isShow: false,
          isAction: false,
          isVoice: false,
          position: 'center',
          isChecked: false,
          isURoidTemplate: true,
        }
      }
    )
    setUserRoids(orderBy(template, ["createdAt"], ["desc"]));
  }, [value, error, loading]);
  return {userRoids, setUserRoids, loadingUroid: loading, error};
}

export default useGetUserRoidsByUserId;
