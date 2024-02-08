import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useCollection} from "react-firebase-hooks/firestore";
import {dataStructureCollRef} from "@/app/common/firebase/dbRefs";
import {orderBy} from "lodash";
import {DataStructure} from "@/app/types/types";

export default function useStructureData() {
  const [, setStructureData] = useStructureDataAtom();

  const [userInfo] = useAtom(userAtomWithStorage);
  const [values, loading, error] = useCollection(dataStructureCollRef(userInfo?.user_id || ""));
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setStructureData(null);
    const _structureData: DataStructure[] = values.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        isCheck: false
      }
    })
    const sortStructureData = orderBy(_structureData, ["index"], ["asc"])
    setStructureData(sortStructureData)
  }, [userInfo?.user_id, values, error, loading])
}
