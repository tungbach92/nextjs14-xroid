import {useEffect, useState} from "react";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {doc} from "firebase/firestore";
import {db} from "@/app/configs/firebase";

function useGetCharacter(characterId: string) {
    const [character, setCharacter] = useState(null);
    const docRef = characterId && doc(db, "characters", characterId);
    const [value, loading, error] = useDocumentData(docRef);
    useEffect(() => {
        if (error || loading || (!loading && !value)) return setCharacter(null);
        const _character = {...value}
        setCharacter(_character)
    }, [value, error, loading])

    return {character, setCharacter, loading, error};
}

export default useGetCharacter;
