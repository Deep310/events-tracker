import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import SideBar from './SideBar'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import './EventsHistory.css'
import MUIDataTable from "mui-datatables"
import { db } from '../firebase'
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'

function EventsHistory() {

    // column names for the data table
    const columns = ["Name", "Event", "Mentor", "Mentee", "Date"];

    const options = {
        filterType: 'checkbox',
    };

    const auth = useAuth();
    const [org, setOrg] = useState('');
    const [attendeeInfo, setAttendeeInfo] = useState(null);
    const [events, setEvents] = useState(null);
    const loading = events === null || attendeeInfo === null;

    let tableData = [];
    if (attendeeInfo) {
        attendeeInfo.forEach((attendee) => {
            let rowData = [];
            rowData.push(attendee.name);
            rowData.push(attendee.event);
            rowData.push(attendee.mentor);
            rowData.push(attendee.mentee);
            rowData.push(attendee.time);
            tableData.push(rowData);
        })
    };

    console.log(tableData);

    const getEventsData = async () => {
        // first of all, we need the name of the user's org
        // fetch it from users collection by using the uid from auth
        const orgRef = doc(db, "users", auth["user"].uid);
        const orgSnap = await getDoc(orgRef);

        // now that we have the org name, use that to search events...
        // ...created by that org in events collection
        const eventsRef = collection(db, "events");
        const eventsQuery = query(eventsRef, where("createdBy", "==", orgSnap.data().orgName));
        const eventsQuerySnapshot = await getDocs(eventsQuery);
        let eventsInfo = [];

        eventsQuerySnapshot.forEach((doc) => {
            eventsInfo.push(doc.id);
        })

        setOrg(orgSnap.data().orgName);
        setEvents(eventsInfo);
    }

    const getAttendeesData = async (events) => {
        // console.log(events);
        let attendeeInformation = [];
        const fetchAttendeesPromises = events.map(async (event) => {
            const attendeesRef = collection(db, "events", event, "attendees");
            const attendeesSnap = await getDocs(attendeesRef);

            attendeesSnap.forEach((doc) => {
                const isItMentor = doc.data().isMentor ? "Yes" : "No";
                const isItMentee = doc.data().isMentee ? "Yes" : "No";
                const attendeeData = {
                    name: doc.id,
                    mentor: isItMentor,
                    mentee: isItMentee,
                    event: event,
                    time: doc.data().checkInTimestamp.toDate().toLocaleDateString('en-US'),
                };

                attendeeInformation.push(attendeeData);
            })

            return attendeeInformation; // also consider { event, attendeeInformation }
        })

        // wait for all attendees to be fetched first!
        const attendeesForAllEvents = await Promise.all(fetchAttendeesPromises)
            .then(attendeeGroups => {
                attendeeGroups.flat()
            }); // and flatten to one array

        // console.log(attendeesForAllEvents);
        setAttendeeInfo(attendeesForAllEvents);

        console.log(attendeeInformation);
        setAttendeeInfo(attendeeInformation);
    }


    useEffect(() => {
        // fetch org name and using that, fetch events created by that org
        // this code will run only once, when mounted, since the dependency array is empty
        getEventsData();
    }, []);

    useEffect(() => {
        // initially runs but does not call the function getAttendeesData because events state is null,
        // but is called again when the events styate is updated with data from previous useEffect
        // passing events state as dependency so it runs whenever that "events" changes
        if (events !== null) {
            getAttendeesData(events);
        }
    }, [events]);

    if (loading) {
        // currently it takes 1-2 seconds to load the page
        // for that time, render a loader here

        return (
            <div className="eventhistory-loader">
                <div className="loader-sidebar">
                    <Skeleton variant="rectangular" animation="wave" width={250} height={1000} />
                </div>
                <div className="loader-mainContent">
                    <Skeleton variant="text" animation="wave" width={300} height={50} />
                    <br />
                    <Skeleton variant="text" animation="wave" width={500} height={50} />
                    <br />
                    <br />
                    <Skeleton variant="rectangular" animation="wave" width={900} height={400} />
                </div>
            </div>
        );
    }

    return (
        <div className="eventhistory-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />
                <main className="eventhistory">
                    <h1>Events History</h1>
                    <h4>View history of all the events created by you and all the attendees in those events.</h4>

                    <MUIDataTable
                        className="event-dataTable"
                        title={"Events History"}
                        data={tableData}
                        columns={columns}
                        options={options}
                    />

                </main>
            </Box>
        </div >
    )
}

export default EventsHistory
