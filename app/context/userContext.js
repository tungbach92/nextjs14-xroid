import {createContext, useContext, useState} from "react";
// import {onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut,} from "firebase/auth";

export const UserContext = createContext({});

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const router = useRouter()

    // useEffect(() => {
    //     setLoading(true);
    //     return onAuthStateChanged(auth, (res) => {
    //         if (res) {
    //             setUser(res);
    //         } else {
    //             setUser(null);
    //         }
    //         setError("");
    //         setLoading(false);
    //     });
    // }, []);
    //
    // const onLogin = (email, password) => {
    //     setLoading(true);
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then((res) => {
    //             router.push('/')
    //         })
    //         .catch((err) => {
    //             setError(err.code)
    //             alert('Your account is not admin')
    //         })
    //         .finally(() => setLoading(false));
    // };
    //
    // const onLogout = () => {
    //     signOut(auth).then(r => router.push('/login'));
    // };
    //
    // const forgotPassword = (email) => {
    //     return sendPasswordResetEmail(auth, email);
    // };

    const contextValue = {
        user,
        loading,
        error,
        // onLogin,
        // onLogout,
        // forgotPassword,
    };
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};