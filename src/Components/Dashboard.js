import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import './Dashboard.css'
import Box from '@mui/material/Box'
import Card from './DashboardCard'

function Dashboard() {
    const auth = useAuth();
    // const [state, setState] = useState({
    //     userData: null,
    //     org: ''
    // });

    const [userData, setUserData] = useState('');
    const [org, setOrg] = useState('');

    useEffect(() => {
        async function getUserData() {
            // console.log(auth);
            const docRef = doc(db, "users", auth['user'].uid);
            const docSnap = await getDoc(docRef);

            // console.log(docSnap.data(), docSnap.data().orgName);
            // console.log(userData) is null

            setUserData(docSnap.data());
            setOrg(docSnap.data().orgName.toUpperCase());
            // console.log("hi", userData, org);
        }

        // edit tab title
        document.title = "Trackd - Dashboard";

        // console.log(userData, org, "hi");

        return getUserData();
    }, []);

    return (
        <div className="dashboard-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />

                <div className="dashboard">

                    <h1>Welcome, {org}</h1>
                    {/* <p>You are logged in as {auth.user.email}</p>
                    <p>Your id is {auth.user.uid}</p> 

                    when user first signs up and gets redirected to dashboard...
                ... the userData object will be null so insert a condition for that */}
                    <h3>Events Stats</h3>
                    <div className="dashboard-cards">
                        <Card bg={'#EF4770'} title={'Total Events'} dataNumber={userData.totalEvents} descText={'You have created a total of 10 events.'} />
                        <Card bg={'#6200FF'} title={'Total Attendees'} dataNumber={35} descText={'A total of 35 attendees have attended your events.'} />
                        <Card bg={'#06D8A1'} title={'Total Mentors'} dataNumber={12} descText={'A total of 12 mentors have attended your events.'} />
                        <Card bg={'#FF8B01'} title={'Total Mentees'} dataNumber={18} descText={'A total of 18 mentees have attended your events.'} />

                    </div>
                </div>
            </Box>
        </div>
    )
}

export default Dashboard
