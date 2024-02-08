import {useAtom} from "jotai";
import {userAtom} from "../store/atom/user.atom";
import {useEffect} from "react";
import {useDocument} from "react-firebase-hooks/firestore";
import {userDocRef} from "@/app/common/firebase/dbRefs";


const useUser = () => {
    const [user, setUser] = useAtom(userAtom)
    const userRef = userDocRef("docId") // userDocRef
    const [data, loading, error] = useDocument(userRef)

    useEffect(() => {
        // fetch user ScenarioData
        if (loading || error || (!data && !loading))
            return;

        setUser({...data?.data(), id: data?.id})

    }, [data, loading, error])

    return {user, setUser}
}
