import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, collection, query, where, QuerySnapshot, setDoc } from 'firebase/firestore'
import './Dashboard.css'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Card from './DashboardCard'
import LineChart from './LineChart'

function Dashboard() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState('');
    const [org, setOrg] = useState('');
    const [eventsInfo, setEventsInfo] = useState([]);
    const [checkInStatus, setCheckInStatus] = useState(0);

    const handleCheckInStatusClick = async (eventName) => {
        // console.log(eventName);

        // search for this event in events collection...
        // ... get the value of its isOpenForCheckIn field and...
        // ... inverse the value based on the current value
        const eventRef = doc(db, "events", eventName);
        const eventSnap = await getDoc(eventRef);

        // if it is true, update it to false the vice versa
        if (eventSnap.data().isOpenForCheckIn) {
            // console.log("I am open for check-in. I want to be closed.");

            // I am doing a force state update here
            // REMINDER: THINK OF ANOTHER WAY TO SOLVE THIS
            setCheckInStatus(checkInStatus + 1);
            console.log(checkInStatus);

            setDoc(eventRef, {
                isOpenForCheckIn: false
            },
                {
                    merge: true
                });
        }
        else {
            // console.log("I am closed for check-in. I want to be open.");
            setCheckInStatus(checkInStatus + 1);
            console.log(checkInStatus);

            setDoc(eventRef, {
                isOpenForCheckIn: true
            },
                {
                    merge: true
                });
        }
    }

    useEffect(() => {
        // edit tab title
        document.title = "Trackd - Dashboard";

        async function getUserData() {
            // console.log(auth);

            // first thing we need - info for the metrics cards
            // that is info about total events, attendees, mentors, and mentees
            const docRef = doc(db, "users", auth['user'].uid);
            const docSnap = await getDoc(docRef);

            // We need the org name to add with the "Welcome... " text
            // extract it from doc returned from previous query
            const orgName = docSnap.data().orgName;

            // fetch all the events created by the user from "events" collection
            // along with their check-in status to display on dashboard
            const eventsRef = collection(db, "events");
            const eventsQuery = query(eventsRef, where("createdBy", "==", orgName));
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

            // fetch all docs from the attendees subcollection
            const attendeesRef = collection(db, "events",)

            setOrg(orgName);
            setUserData(docSnap.data());
        }

        getUserData();

        // this hook should re-render when the event status changes
        // which means when there is an update in check in status of event, re-render the hook
        // this is to make sure the text on the button updates in real time after re-render
    }, [checkInStatus]);

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

                            {eventsInfo ? eventsInfo.map(function (event, i) {
                                // console.log(event.creationTime)
                                return (
                                    <div key={i}>
                                        <div className="dashboard-eventItem">
                                            <p>{event.eventName}</p>
                                            <Button
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f6f8fa',
                                                    },
                                                }}
                                                onClick={() => handleCheckInStatusClick(event.eventName)}
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
                                    </div>
                                )
                            }) : <p>No events to show</p>}
                        </div>

                        <div className="dashboard-graph">
                            <h2>Attendees over time</h2>
                            <LineChart />

                        </div>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export default Dashboard
