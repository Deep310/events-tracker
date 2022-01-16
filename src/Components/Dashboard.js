import React, { useState, useEffect } from 'react'
import NavBar from './NavBar';
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import './Dashboard.css'

function Dashboard() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        function getUserData() {
            const docRef = doc(db, "users", auth['user'].uid);
            getDoc(docRef)
                .then((doc) => {
                    console.log(doc.data(), doc.id);
                    setUserData(doc.data());

                })
        }

        getUserData();
    }, []);

    return (
        <>
            <NavBar />
            <div className="dashboard">

                <p>You are logged in as {auth.user.email}</p>
                <p>Your id is {auth.user.uid}</p>

                {/* when user first signs up and gets redirected to dashboard...
                ... the userData object will be null so insert a condition for that */}
                <p>You have {userData ? userData.events : 0} events created.</p>
            </div>
        </>
    )
}

export default Dashboard
