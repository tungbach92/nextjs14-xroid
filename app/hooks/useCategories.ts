import {useEffect} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {categoriesRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {categoryAtom} from "@/app/store/atom/categories.atom";
import {orderBy} from "lodash";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

export const useCategories = () => {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [categories, setCategories] = useAtom(categoryAtom)
  const [values, loading, error] = useCollection(categoriesRef(userInfo?.user_id))
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setCategories(null);
    const _categories = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        }
      }
    )
    const reOrderCategories = orderBy(_categories, 'index', 'asc')
    setCategories(reOrderCategories)
  }, [values, error, loading])

  return {categories, loading, error};
}
