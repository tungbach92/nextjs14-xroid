import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {voicesColRef} from "@/app/common/firebase/dbRefs";
import {Voice} from "@/app/types/types";
import {orderBy} from "lodash";

function useGetAllCharacterVoice(characterId: string) {
    const [allCharacterVoice, setAllCharacterVoice] = useState<Voice[]>([])
    const [dataSnap, loading, error] = useCollection(voicesColRef(characterId));
    useEffect(() => {
        if (error || loading || (!loading && !dataSnap)) return setAllCharacterVoice(null);
        const newData = dataSnap.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate(),
            }
        })
      setAllCharacterVoice(orderBy(newData, ['updatedAt'], ['desc']))
    }, [characterId, dataSnap, error, loading])
    return {allCharacterVoice, setAllCharacterVoice, loading, error}
}

export default useGetAllCharacterVoice;
