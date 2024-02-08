import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {charactersRef, defaultCharactersRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {charactersAtom} from "@/app/store/atom/characters.atom";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {orderBy} from "lodash";
import {Character} from "@/app/types/types";
import useGetUserRoidsByUserId from "@/app/hooks/useGetUserRoidsByUserId";
import {createdUroidChapterByUser} from "@/app/common/commonApis/userRoidsApi";

export const useCharacters = () => {
  const [userInfo] = useAtom(userAtomWithStorage);
  const {userRoids} = useGetUserRoidsByUserId(userInfo.user_id)
  const [characters, setCharacters] = useAtom(charactersAtom)
  const [values, loading, error] = useCollection(charactersRef(userInfo.user_id))
  const [defaultCharacters, setDefaultCharacters,] = useState<Character[]>([])
  const [defaultValue] = useCollection(defaultCharactersRef())
  const [createdUroidChapters, setCreatedUroidChapters] = useState<Character[]>([])

  useEffect(() => {
    createdUroidChapterByUser()
      .then(res => {
        const data = res?.data
        setCreatedUroidChapters(data)
      })
      .catch(err => console.log(err))
  }, [userRoids])

  useEffect(() => {
    if (error || loading || (!loading && !values)) {
      setCharacters(null);
      return;
    }
    if (error || loading || (!loading && !defaultCharacters)) {
      setDefaultCharacters(null);
      return;
    }

    const _defaultCharacters: Character[] = defaultValue?.docs?.map((document) => {
        return {
          ...document.data(),
          id: document.id,
          avatar: document.data()?.avatar || '',
          isShow: false,
          isAction: false,
          isVoice: false,
          position: document.data()?.displayName === 'Mentoroid' ? 'left'
            : document.data()?.displayName === 'Ena' ? 'center'
              : document.data()?.displayName === 'Rabbit' ? 'right' : '',
          isChecked: false,
          isURoidTemplate: false,
        } satisfies Character
      }
    )
    const _characters: Character[] = values?.docs?.map((document) => {
        return {
          ...document.data(),
          id: document.id,
          avatar: document.data()?.avatar || '',
          isShow: false,
          isAction: false,
          isVoice: false,
          position: document.data()?.displayName === 'Mentoroid' ? 'left'
            : document.data()?.displayName === 'Ena' ? 'center'
              : document.data()?.displayName === 'Rabbit' ? 'right' : '',
          isChecked: false,
          isURoidTemplate: false,
        }
      }
    )
    setDefaultCharacters(orderBy(_defaultCharacters, 'createdAt', 'asc'))
    setCharacters(orderBy(_defaultCharacters?.concat(_characters).concat(createdUroidChapters), 'createdAt', 'asc'))
  }, [values, error, loading, userInfo, defaultValue, createdUroidChapters])

  return {characters, loading, error, setCharacters, defaultCharacters,createdUroidChapters};
}
