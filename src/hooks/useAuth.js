import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from '../firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

// cutom hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authenticating, setAuthenticating] = useState(true);

    // wrap the firebase sign up, sign in, and sign out methods
    // and save the user to state after each method call

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                // successsfully logged user in with email and password
                // returns an object with all user credentials

                setUser(response.user);
                console.log(response.user);
                return response.user;
            });
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((response) => {
                // successfully created a new user with the given email and password
                // returns an object with all user credentials

                setUser(response.user);
                console.log(response.user);

                const uid = response['user'].uid;
                // console.log(uid);
                const data = {
                    events: 0,
                    timestamp: serverTimestamp()
                };

                const newDoc = doc(db, "users", uid);
                setDoc(newDoc, data);

                return response.user;
            });
    };

    const logout = () => {
        return signOut(auth)
            .then(() => {
                setUser(false);
                console.log("logged out");

            });
    };

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthenticating(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // The user object and auth methods
    const values = {
        user,
        authenticating,
        login,
        signup,
        logout,
    };

    return (
        // Provider component that wraps your app and makes auth object
        // ... available to any child component that calls useAuth().
        <AuthContext.Provider value={values}>
            {!authenticating && children}
        </AuthContext.Provider>
    )
}

