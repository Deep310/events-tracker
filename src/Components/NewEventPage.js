import React, { useState } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs, getDoc, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { useAuth } from '../hooks/useAuth'
import SideBar from './SideBar'
import { Button, Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import './NewEventPage.css'

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

function NewEventPage() {
    const auth = useAuth();

    // states to store user inputted values
    const [eventName, setEventName] = useState('');
    const [eventCode, setEventCode] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isOpen, setIsOpen] = useState('');
    const [isOnline, setIsOnline] = useState('');

    // event description field will be optional
    const [eventDesc, setEventDesc] = useState('');

    // states to check if the fields are empty 
    // if they are, show error by setting material ui textfield prop - error to true
    const [eventNameError, setEventNameError] = useState(false);
    const [eventCodeError, setEventCodeError] = useState(false);
    const [eventDateError, setEventDateError] = useState(false);
    const [isOpenError, setIsOpenError] = useState(false);
    const [isOnlineError, setIsOnlineError] = useState(false);

    // don't need to check for event description error since it is optional
    // const [eventDescError, setEventDescError] = useState(false);

    const handleOpenFieldChange = (e) => {
        setIsOpen(e.target.value);
    };

    const handleOnlineFieldChange = (e) => {
        setIsOnline(e.target.value);
    };

    const handleCancel = (e) => {
        e.preventDefault();

        // clear the form fields without doing any backend work.
        setEventName('');
        setEventCode('');
        setEventDate('');
        setIsOpen('');
        setIsOnline('');
        setEventDesc('');

        setEventNameError(false);
        setEventCodeError(false);
        setEventDateError(false);
        setIsOpenError(false);
        setIsOnlineError(false);
    };

    const handleSubmit = async (e) => {
        // prevent browser from refreshing automatically
        e.preventDefault();

        // if any of the fields is empty (except description), 
        // make it red by setting error state true
        if (eventName === '') {
            setEventNameError(true);
        }

        if (eventCode === '') {
            setEventCodeError(true);
        }

        if (eventDate === '') {
            setEventDateError(true);
        }

        if (isOpen === '') {
            setIsOpenError(true);
        }

        if (isOnline === '') {
            setIsOnlineError(true);
        }

        // implement the backend functionality only if all the fields are filled properly
        if (eventName && eventCode && eventDate && isOpen && isOnline) {

            // actual backend logic goes here
            // on hitting 'create' button, perform following checks
            // 1) Is the event already created by the admin org?
            // 2) Does the check-in code already exist?

            // ... by implementing second check, I don't have to ask...
            // ... the user for the event name during check-in

            // if answer to any of the above checks is true, then show the user...
            // ... appropriate alert and return from the function

            // ------------------------------------------------------------------------------------------

            // check 1 - Is the event already created by the admin org?
            // search events collection for the same event name and if there is one...
            // ...check the createdBy field of that event
            const orgNameRef = doc(db, "users", auth.user.uid);
            const orgNameSnap = await getDoc(orgNameRef);

            let orgName;
            let totalEventsCreated = -1;

            if (orgNameSnap.exists()) {
                // console.log(orgNameSnap.data());
                orgName = orgNameSnap.data().orgName;
                totalEventsCreated = orgNameSnap.data().totalEvents;
                console.log(orgName, totalEventsCreated);
                // console.log("I am", orgName);
            }

            // query events collection to check for an event with same name as user inputted event name
            // if there is one, check if it is created by the org name
            const eventsRef = doc(db, "events", eventName.toLowerCase());
            const eventNameSnap = await getDoc(eventsRef);

            if (eventNameSnap.exists()) {
                if (eventNameSnap.data().createdBy === orgName) {
                    console.log("You failed check 1");
                    alert("You have already created this event. You can't create the same event again.");
                    return;
                }
            }

            // -----------------------------------------------------------------------------------------------------------------

            // check 2 - does the check-in code already exist?
            // go through all docs of events collection to search for user inputted check in code
            const checkInCodeRef = collection(db, "events");
            const checkInCodeQuery = query(checkInCodeRef, where("checkInCode", "==", eventCode));

            const codeSnapshot = await getDocs(checkInCodeQuery);

            // if there is a doc, then alert the user that...
            // ... he has to use a different code since the one he entered already exists
            if (codeSnapshot.docs.length !== 0) {
                console.log("You failed check 2");
                alert("You have already used this check-in code for one of your previous events. Please use a unique code for each event.");
                return;
            }

            else {
                // now finally all checks are passed so add a new doc...
                // ... in events collection with appropriate data...
                // ... and update totalEvents count in user doc in users collection
                const openChhe = isOpen === "Yes" ? true : false;
                const onlineChhe = isOnline === "Yes" ? true : false;
                let newEventData;

                if (totalEventsCreated === 0) {
                    newEventData = {
                        createdAt: serverTimestamp(),
                        createdBy: orgName,
                        checkInCode: eventCode,
                        eventStartDate: eventDate,
                        isOpenForCheckIn: openChhe,
                        isItOnline: onlineChhe,
                        eventDescription: eventDesc,
                        totalAttendees: 0,
                        firstEvent: true,
                    };
                }

                else {
                    newEventData = {
                        createdAt: serverTimestamp(),
                        createdBy: orgName,
                        checkInCode: eventCode,
                        eventStartDate: eventDate,
                        isOpenForCheckIn: openChhe,
                        isItOnline: onlineChhe,
                        totalAttendees: 0,
                        eventDescription: eventDesc,
                    };
                }

                const newEventDoc = doc(db, `events/${eventName.toLowerCase()}`);
                setDoc(newEventDoc, newEventData);

                await updateDoc(orgNameRef, {
                    totalEvents: totalEventsCreated + 1
                });
                console.log('Successfully added a new event.');

                // clear form fields
                setEventName('');
                setEventCode('');
                setEventDate('');
                setIsOpen('');
                setIsOnline('');
                setEventDesc('');
            }

        }

    }

    return (
        <div className="newevent-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />

                <div className="newevent">
                    <h1>Create a new event</h1>
                    <h4>It takes less than 1 minute to fill out the following form and create a new event!</h4>

                    <form noValidate autoComplete="off" className="form">
                        <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventName(e.target.value)} error={eventNameError} fullWidth required label="Event Name" variant="outlined" value={eventName} />
                        <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventCode(e.target.value)} error={eventCodeError} fullWidth required label="Check-in Code" variant="outlined" value={eventCode} />
                        <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventDate(e.target.value)} error={eventDateError} fullWidth required label="Event Date (Ex: MM/DD/YYYY)" variant="outlined" value={eventDate} />
                        <TextField
                            sx={{ marginBottom: 5 }}
                            fullWidth
                            required
                            error={isOpenError}
                            select
                            label="Is the event open for check-in?"
                            variant="outlined"
                            value={isOpen}
                            onChange={handleOpenFieldChange}
                        >
                            {options.map((option, key) => (
                                <MenuItem key={key} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            sx={{ marginBottom: 5 }}
                            fullWidth
                            required
                            error={isOnlineError}
                            select
                            label="Is the event online?"
                            variant="outlined"
                            value={isOnline}
                            onChange={handleOnlineFieldChange}
                        >
                            {options.map((option, key) => (
                                <MenuItem key={key} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            sx={{ marginBottom: 5 }}
                            onChange={(e) => setEventDesc(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            label="Event Description (optional)"
                            variant="outlined"
                            value={eventDesc}
                        />

                        <Button
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                                marginBottom: 5,
                            }}
                            onClick={handleSubmit}
                            type="submit"
                            color="primary"
                            variant="contained"
                            disableElevation
                            size="large"
                        >
                            Create
                        </Button>

                        <Button
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                                marginBottom: 5,
                            }}
                            onClick={handleCancel}
                            type="submit"
                            color="primary"
                            variant="contained"
                            disableElevation
                            size="large"
                        >
                            Cancel
                        </Button>
                    </form>

                    {console.log("I am on new events page.")}
                </div>
            </Box>
        </div>
    )
}

export default NewEventPage
