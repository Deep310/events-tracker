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
    // const [eventName, setEventName] = useState('');
    const [code, setCode] = useState('');
    const [isMentee, setIsMentee] = useState('');
    const [isMentor, setIsMentor] = useState('');

    // states to check if the fields are empty 
    // if they are, show error using material ui textfield prop - error
    const [nameError, setNameError] = useState(false);
    const [orgNameError, setOrgNameError] = useState(false);
    // const [eventNameError, setEventNameError] = useState(false);
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

        // if any of the fields is empty, make it red by setting error state true
        if (name === '') {
            setNameError(true);
        }

        if (orgName === '') {
            setOrgNameError(true);
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

        if (isMentor === 'Yes' && isMentee === 'Yes') {
            alert('You can not be a mentor and a mentee. Please answer carefully.');
            return;
        }

        // implement the backend functionality only if all the fields are filled properly
        if (name && orgName && code && isMentee && isMentor) {
            // console.log(name, orgName, eventName, code, isMentee, isMentor);

            // actual backend logic goes here
            // on submit - check following things
            // 1) Does the organization exist?
            // 2) Does a doc with user inputted check-in code exist?
            // 3) Check for createdBy, isOpenForCheckIn fields of that doc
            // 4) Has the user already checked in?
            // if answer to any of the above is true, then show the user...
            // ... appropriate alert and return from the function

            // check 1 - Does the organization exist?
            // write a query to find if a matching doc exists in users collection...
            // ... with orgName field equal to user inputted org name
            const usersRef = collection(db, "users");
            const orgNameQuery = query(usersRef, where("orgName", "==", orgName.toLowerCase()));

            const orgNameSnapshot = await getDocs(orgNameQuery);

            let docId;
            let userOrgName;
            let totalAttendeesCame = -1;
            let totalMentorsCame = -1;
            let totalMenteesCame = -1;

            // if we get 0 docs from the query snapshot...
            // ... it means the organization name doesn't exist in users collection...
            // ... alert the user saying that and return from the function
            if (orgNameSnapshot.docs.length === 0) {
                alert("The organization does not exist. Did you enter the name correctly?");
                return;
            }

            orgNameSnapshot.forEach((doc) => {
                // there will only be one doc with the matching org name
                docId = doc.id;
                console.log(doc.data(), docId);

                userOrgName = doc.data().orgName;
                totalAttendeesCame = doc.data().totalAttendees;
                totalMentorsCame = doc.data().totalMentors;
                totalMenteesCame = doc.data().totalMentees;
                console.log(userOrgName, totalAttendeesCame, totalMentorsCame, totalMenteesCame);

                console.log("this is first console log");
            });

            // ---------------------------------------------------------------------------------------------------

            // check 2 - Does a doc with user inputted check-in code exist?
            // map through the events collection to find a doc whose...
            // ... checkInCode field matches the user inputted check in code
            // if such a doc exists, that means the event exists from that org
            const eventsRef = collection(db, "events");
            const codeQuery = query(eventsRef, where("checkInCode", "==", code));

            const codeQuerySnapshot = await getDocs(codeQuery);
            let eventDocData;
            let eventDocId;

            // if the snapshot doesn not exist...
            // ... it means the check-in code doesn't exist in events collection
            // alert the user saying that and return from the function
            if (codeQuerySnapshot.docs.length === 1) {

                // the doc exists with the given check-in code
                // save the doc data to use it in next checks
                codeQuerySnapshot.forEach((doc) => {
                    // there will and must only be one doc with the matching code
                    // console.log(doc.id, " => ", doc.data());
                    eventDocData = doc.data();
                    eventDocId = doc.id;
                    // console.log(eventDocId, eventDocData);
                });
            }
            else {
                // mostl ikely there are no docs with the given check-in code
                // it is also possible that there are more than 1 docs..(CONFIRM THIS IS FALSE)
                // console.log("Can't find this code sorry dude.");
                alert(`The check-in code is incorrect. Please enter the code provided by the e-board members of ${orgName}.`);
                return;
            }

            // --------------------------------------------------------------------------------------------------

            // check 3 - Is the event created by the organization and is it open to check-in?
            // now that we know that the checkin code exists...
            // ... get data of that doc and check if it was created by the inputted org...
            // ... and check if it is open for check-in or not
            if (eventDocData.createdBy === orgName.toLowerCase() && eventDocData.isOpenForCheckIn) {
                console.log(`${orgName} created this event and it is open for check-in.`);
            }
            else {
                alert(`Either this event is not created by ${orgName} or this event is not open for check-in.`);
                return;
            }

            // ------------------------------------------------------------------------------------------------------

            // check 4 - Has the user already checked in? (last check finally!!!)
            // if the user doesn't exist in eventname/attendee collection...
            // ...add him to the attendees collection. Show an alert if he exists already. 
            const attendeeRef = doc(db, `events/${eventDocId}/attendees/${name}`);
            const attendeeSnap = await getDoc(attendeeRef);

            if (attendeeSnap.exists()) {
                alert("You have already checked-in to the event. You can't check-in again.")
                console.log(attendeeSnap.data());
            }
            else {
                // if the attendee does not exist in attendees collection...
                // ...make a new doc with doc.id = attendee name and set all the data fields
                const isItMentee = isMentee === "Yes" ? true : false;
                const isItMentor = isMentor === "Yes" ? true : false;
                const newAttendeeData = {
                    checkInTimestamp: serverTimestamp(),
                    isMentee: isItMentee,
                    isMentor: isItMentor,
                }

                const newAttendeeDoc = doc(db, `events/${eventDocId}/attendees/${name}`);
                setDoc(newAttendeeDoc, newAttendeeData);
                console.log('attendee does not exist. So I added him');
                //console.log('Finally all checks passed!! whooooof');

                // now update the fields in document of the org in users collection
                // 
                const docRef = doc(db, "users", docId);

                if (isItMentor && !isItMentee) {
                    setDoc(docRef, {
                        totalAttendees: totalAttendeesCame + 1,
                        totalMentors: totalMentorsCame + 1,
                    },
                        {
                            merge: true
                        });
                }

                if (!isItMentor && isItMentee) {
                    setDoc(docRef, {
                        totalAttendees: totalAttendeesCame + 1,
                        totalMentees: totalMenteesCame + 1
                    },
                        {
                            merge: true
                        });
                }

                if (!isItMentor && !isItMentee) {
                    setDoc(docRef, {
                        totalAttendees: totalAttendeesCame + 1,
                    },
                        {
                            merge: true
                        });
                }

                console.log('Successfully added a new attendee.');

            }

            // ----------------------------------------------------------------------------------

            // clear all fields - reset their states
            setName('');
            setOrgName('');
            setCode('');
            setIsMentee('');
            setIsMentor('');

            setNameError(false);
            setOrgNameError(false);
            setCodeError(false);
            setIsMenteeError(false);
            setIsMentorError(false);
        }

    }

    return (
        <>
            <NavBar />
            <Container>
                <p>Welcome, user</p>

                <form noValidate onSubmit={handleSubmit} autoComplete="off" className="form">
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setName(e.target.value)} error={nameError} fullWidth required label="Full Name" variant="outlined" value={name} />
                    <TextField sx={{ marginBottom: 5 }} onChange={(e) => setOrgName(e.target.value)} error={orgNameError} fullWidth required label="Organization Name" variant="outlined" value={orgName} />
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
