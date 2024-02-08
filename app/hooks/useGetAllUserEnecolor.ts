import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {Enecolor} from "@/app/types/block";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";
import {useEffect} from "react";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {TEST_AND_OWNER_ID} from "../../common/ownerId";

export const useGetAllUserEnecolor = (adminEnecolors: Enecolor[]) => {
  const enecolors = useAtomValue(enecolorsAtom)
  const setAllUserEnecolors = useSetAtom(allUserEnecolorsAtom)
  const [userInfo] = useAtom(userAtomWithStorage);
  const isAdmin = TEST_AND_OWNER_ID.includes(userInfo?.user_id)
  useEffect(() => {
    if (!isAdmin) {
      const combinedEnecolors = [...(adminEnecolors ?? []), ...(enecolors ?? [])]
      setAllUserEnecolors(combinedEnecolors)
    } else
      setAllUserEnecolors(enecolors)
  }, [enecolors, adminEnecolors, isAdmin])
}
