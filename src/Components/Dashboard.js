import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import './Dashboard.css'
import Box from '@mui/material/Box'

function Dashboard() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [org, setOrg] = useState('');

    useEffect(() => {
        async function getUserData() {
            // console.log(auth);
            const docRef = doc(db, "users", auth['user'].uid);
            const docSnap = await getDoc(docRef);

            const docData = docSnap.data();
            setUserData(docData);
            setOrg(docData.orgName);

            console.log(userData, docSnap.id);
        }

        getUserData();

        // edit tab title
        document.title = "Trackd - Dashboard";

    }, [auth.user]);

    return (
        <div className="dashboard-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />

                <div className="dashboard">

                    <h1>Welcome, {org.toUpperCase()}</h1>
                    <p>You are logged in as {auth.user.email}</p>
                    <p>Your id is {auth.user.uid}</p>

                    {/* when user first signs up and gets redirected to dashboard...
                ... the userData object will be null so insert a condition for that */}
                    <p>You have {userData ? userData.totalEvents : -1} events created.</p>
                    <p>Your timestamp is {userData ? "hi" : "null"}. </p>
                    <p>Your organization name is {org}.</p>
                </div>
            </Box>
        </div>
    )
}

export default Dashboard
