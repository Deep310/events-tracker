import React, { useState } from 'react'
import { db } from '../firebase';
import { collection, query, where, getDocs, getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import NavBar from './NavBar';
import { useAuth } from '../hooks/useAuth'
import { Button, Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import './CheckInPage.css';

const options = [
    {
        value: 'Yes',
        label: 'Yes',
    },
    {
        value: 'No',
        label: 'No',
    },
]

// Event participants will use this page to check-in to the events
// They will most likely use their phones to enter the code and check-in
// hence, this page has to be responsive on mobile
// develop the UI with a mobile-first approach
function CheckInPage() {
    const auth = useAuth();

    // states to save data of all the fields in the form
    const [name, setName] = useState('');
    const [orgName, setOrgName] = useState('');
    const [eventName, setEventName] = useState('');
    const [code, setCode] = useState('');
    const [isMentee, setIsMentee] = useState('');
    const [isMentor, setIsMentor] = useState('');

    // states to check if the fields are empty 
    // if they are, show error using material ui textfield prop - error
    const [nameError, setNameError] = useState(false);
    const [orgNameError, setOrgNameError] = useState(false);
    const [eventNameError, setEventNameError] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [isMenteeError, setIsMenteeError] = useState(false);
    const [isMentorError, setIsMentorError] = useState(false);

    // const [orgDocId, setOrgDocId] = useState(null);
    // const [eventDocData, setEventDocData] = useState(null);

    const handleMenteeChange = (e) => {
        setIsMentee(e.target.value);
    };

    const handleMentorChange = (e) => {
        setIsMentor(e.target.value);
    };


    const handleSubmit = async (e) => {
        // prevent page from refreshing automatically
        e.preventDefault();

        // users with an account on Trackd are not allowed to check-in
        // this makes sure the 2 user bases - attendees and club admins...
        // ... remian separate and do not interact with each other
        if (auth.user) {
            // clear all the fields as well
            alert("Registered users can't check-in to the events.");
            return;
        }

        if (name === '') {
            setNameError(true);
        }

        if (orgName === '') {
            setOrgNameError(true);
        }

        if (eventName === '') {
            setEventNameError(true);
        }

        if (code === '') {
            setCodeError(true);
        }

        if (isMentee === '') {
            setIsMenteeError(true);
        }

        if (isMentor === '') {
            setIsMentorError(true);
        }

        if (name && orgName && eventName && code && isMentee && isMentor) {
            // console.log(name, orgName, eventName, code, isMentee, isMentor);

            // actual backend logic goes here
            // on submit - check following things
            // 1) Does the organization exist?
            // 2) Does the event exist?
            // 3) Is the event created by the organization?
            // 4) Is the event open for check-in?
            // 5) Is the check-in code correct?
            // 6) Has the user already checked in?
            // if answer to any of the above is false, then show the user...
            // ... appropriate alert and return from the function

            // check 1 - Does the organization exist?
            // write a query to find if a matching doc exists in users collection...
            // ... with orgName field equal to user inputted org name
            const usersRef = collection(db, "users");
            const orgNameQuery = query(usersRef, where("orgName", "==", orgName.toLowerCase()));

            const orgNameSnapshot = await getDocs(orgNameQuery);

            // if we get 0 docs from the query snapshot...
            // ... it means the organization name doesn't exist in users collection...
            // ... alert the user saying that and return from the function
            if (orgNameSnapshot.docs.length === 0) {
                alert("The organization does not exist. Did you enter the name correctly?");
                return;
            }

            orgNameSnapshot.forEach((doc) => {
                // there will only be one doc with the matching org name
                console.log(doc.id, " => ", doc.data());
            });

            // console.log(orgDocId);

            // ---------------------------------------------------------------------------------------------------

            // check 2 - Does the event exist in the organization?
            // map through the events collection to find a doc whose...
            // ... createdBy field matches the doc id returned from check 1
            // if such a doc exists, that means the event exists from that org
            const eventRef = doc(db, "events", eventName.toLowerCase());
            const eventNameSnap = await getDoc(eventRef);
            let eventDocData;

            // if the snapshot doesn not exist...
            // ... it means the event name doesn't exist in events collection
            // alert the user saying that and return from the function
            if (eventNameSnap.exists()) {
                console.log(eventNameSnap.id, " => ", eventNameSnap.data());
                eventDocData = eventNameSnap.data();

                // use a state to store the event data
                // we will need it to for rest of the checks
                // setEventDocData(eventNameSnap.data());
            }
            else {
                alert("The event does not exist. Did you enter the name correctly?");
                return;
            }

            console.log(eventDocData);

            // --------------------------------------------------------------------------------------------------

            // check 3 - Is the event created by the organization
            // now that we know that the event name exists...
            // ... get data of that doc and check if it was created by...
            // ... the user inputted org by matching it with createdBy field in doc
            if (eventDocData.createdBy == orgName.toLowerCase()) {
                console.log(eventDocData.createdBy, "created", eventName.toLowerCase());
            }
            else {
                alert(`The event is not created by ${orgName}. Did you enter the name correctly?`);
                return;
            }

            // ------------------------------------------------------------------------------------------------------

            // check 4 - Is the event open for check-in?
            // now that we know the event name exists and it is created by the inputted org...
            // ...check if the user is allowed to check in to the event or not...
            // ...by checking the value of isOpenForCheckIn field in the doc
            if (eventDocData.isOpenForCheckIn) {
                console.log(eventName.toLowerCase(), "is open for check in");
            }
            else {
                alert(`${eventName} is not open for check-in.`);
                return;
            }

            // -------------------------------------------------------------------------------------------------

            // check 5 - Is the check in code correct? 
            // now that we've confirmed ...everything about the event
            // check if the code is actually correct by matching it with...
            // ...checkInCode field of the event doc
            if (eventDocData.checkInCode == code) {
                console.log("The access code is correct.");
            }
            else {
                alert(`${code} is not the same as ${eventDocData.checkInCode}`);
                return;
            }

            // ------------------------------------------------------------------------------------------------------

            // check 6 - Has the user already checked in? (last check finally!!!)
            // if the user doesn't exist in eventname/attendee collection...
            // ...add him to the attendees collection. Show an alert if he exists already. 
            const attendeeRef = doc(db, `events/${eventName.toLowerCase()}/attendees/${name}`);
            const attendeeSnap = await getDoc(attendeeRef);

            if (attendeeSnap.exists()) {
                alert("You have already checked-in to the event. You can't check-in again.")
                console.log(attendeeSnap.data());
            }
            else {
                // if the attendee does not exist in attendees collection...
                // ...make a new doc with doc.id = attendee name and set all the data fields
                const isItMentee = isMentee == "Yes" ? true : false;
                const isItMentor = isMentor == "Yes" ? true : false;
                const newAttendeeData = {
                    checkInTimestamp: serverTimestamp(),
                    isMentee: isItMentee,
                    isMentor: isItMentor,
                }

                const newAttendeeDoc = doc(db, `events/${eventName.toLowerCase()}/attendees/${name}`);
                setDoc(newAttendeeDoc, newAttendeeData);
                console.log('attendee does not exist. So I added him');
                console.log('Finally all checks passed!! whooooof');
            }

            // ----------------------------------------------------------------------------------

            // clear all fields - reset their states
            setName('');
            setOrgName('');
            setEventName('');
            setCode('');
            setIsMentee('');
            setIsMentor('');

            setNameError(false);
            setOrgNameError(false);
            setEventNameError(false);
            setCodeError(false);
            setIsMenteeError(false);
            setIsMentorError(false);
        }

    }

    return (
        <>
            <NavBar />
            <Container>
                {auth.user ? <p>hi</p> : <p>bye</p>}
                <p>Welcome, user</p>

                <form noValidate onSubmit={handleSubmit} autoComplete="off" className="form">
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setName(e.target.value)} error={nameError} fullWidth required label="Full Name" variant="outlined" value={name} />
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setOrgName(e.target.value)} error={orgNameError} fullWidth required label="Organization Name" variant="outlined" value={orgName} />
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventName(e.target.value)} error={eventNameError} fullWidth required label="Event Name" variant="outlined" value={eventName} />
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setCode(e.target.value)} error={codeError} fullWidth required label="Check-in Code" variant="outlined" value={code} />
                    <TextField
                        sx={{ marginBottom: 5 }}
                        fullWidth
                        required
                        error={isMenteeError}
                        select
                        label="Are you a mentee?"
                        variant="outlined"
                        value={isMentee}
                        onChange={handleMenteeChange}
                    >
                        {options.map((option, key) => (
                            <MenuItem key={key} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginBottom: 5 }}
                        required
                        error={isMentorError}
                        select
                        label="Are you a mentor?"
                        variant="outlined"
                        value={isMentor}
                        onChange={handleMentorChange}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        sx={{
                            '&:hover': {
                                backgroundColor: 'black',
                            },
                            marginBottom: 5,
                        }}
                        type="submit"
                        color="primary"
                        variant="contained"
                        disableElevation
                        size="large"
                    >
                        Check-in
                    </Button>
                </form>

            </Container>
        </>
    )
}

export default CheckInPage
