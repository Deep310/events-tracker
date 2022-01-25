import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, collection, query, where, QuerySnapshot } from 'firebase/firestore'
import './Dashboard.css'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Card from './DashboardCard'

function Dashboard() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState('');
    const [org, setOrg] = useState('');
    const [eventsInfo, setEventsInfo] = useState([]);

    useEffect(() => {
        // edit tab title
        document.title = "Trackd - Dashboard";

        async function getUserData() {
            // console.log(auth);
            const docRef = doc(db, "users", auth['user'].uid);
            const docSnap = await getDoc(docRef);

            const orgName = docSnap.data().orgName.toUpperCase();


            const eventsRef = collection(db, "events");
            const eventsQuery = query(eventsRef, where("createdBy", "==", orgName.toLowerCase()));
            const eventsQuerySnapshot = await getDocs(eventsQuery);
            let eventsObject = [];

            eventsQuerySnapshot.forEach(doc => {
                const eventName = doc.id;
                const eventIsOpen = doc.data().isOpenForCheckIn;
                const creationTime = doc.data().createdAt.toDate().toDateString();

                const eventsInfoItem = {
                    eventName,
                    eventIsOpen,
                    creationTime
                };

                eventsObject.push(eventsInfoItem);
                setEventsInfo(eventsObject);

            });

            db.collection("events").doc("usacs labs 1").collection("attendees")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        console.log(doc.id, "=>", doc.data());
                    })
                })
                .catch(err => {
                    console.error("Got an error", err);
                });

            setUserData(docSnap.data());
            setOrg(orgName);
        }

        getUserData();
        // console.log("i am events", eventsInfo);
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
                    <section className="dashboard-cards">
                        <Card bg={'#EF4770'} title={'Total Events'} dataNumber={userData.totalEvents} descText={`You have created a total of ${userData.totalEvents} events.`} />
                        <Card bg={'#6200FF'} title={'Total Attendees'} dataNumber={userData.totalAttendees} descText={`A total of ${userData.totalAttendees} attendees have attended your events.`} />
                        <Card bg={'#06D8A1'} title={'Total Mentors'} dataNumber={userData.totalMentors} descText={`A total of ${userData.totalMentors} mentors have attended your events.`} />
                        <Card bg={'#FF8B01'} title={'Total Mentees'} dataNumber={userData.totalMentees} descText={`A total of ${userData.totalMentees} mentees have attended your events.`} />

                    </section>

                    <div className="dashboard-lower-container">
                        <div className="dashboard-events">
                            <div className="dashboard-eventsTitle">
                                <h2>Your Events</h2>
                                <Button
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'black',
                                        },
                                    }}
                                    onClick={() => navigate("/new-event")}
                                    startIcon={<AddIcon />}
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disableElevation
                                    size="large"
                                >
                                    New Event
                                </Button>
                            </div>

                            {eventsInfo.map(function (event, i) {
                                console.log(event.creationTime)
                                return (
                                    <>
                                        <div key={i} className="dashboard-eventItem">
                                            <p>{event.eventName}</p>
                                            <Button
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#d3d3d3',
                                                    },
                                                }}
                                                onClick={() => navigate("/new-event")}
                                                color="warning"
                                                type="submit"
                                                variant="contained"
                                                disableElevation
                                                size="small"
                                            >
                                                {event.eventIsOpen ? "Close for check-in" : "Open for check-in"}
                                            </Button>
                                        </div>
                                        <hr />
                                    </>
                                )
                            })}
                        </div>

                        <div className="dashboard-graph">
                            <h2>Attendee vs Time Chart</h2>
                        </div>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export default Dashboard
