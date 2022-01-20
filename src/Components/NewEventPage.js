import React, { useState } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs, getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useAuth } from '../hooks/useAuth'
import SideBar from './SideBar'
import Box from '@mui/material/Box'
import { Button, Container } from '@mui/material'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { makeStyles } from '@mui/styles'
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

const useStyles = makeStyles({
    input: {
        color: "#fff"
    }
});

function NewEventPage() {
    const auth = useAuth();
    const classes = useStyles();

    // states to store user inputted values
    const [eventName, setEventName] = useState('');
    const [eventCode, setEventCode] = useState('');
    const [isOpen, setIsOpen] = useState('');
    const [isOnline, setIsOnline] = useState('');

    // event description field will be optional
    const [eventDesc, setEventDesc] = useState('');

    // states to check if the fields are empty 
    // if they are, show error using material ui textfield prop - error
    const [eventNameError, setEventNameError] = useState(false);
    const [eventCodeError, setEventCodeError] = useState(false);
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
        setIsOpen('');
        setIsOnline('');
        setEventDesc('');
        console.log("You cancelled me.");
    };

    const handleSubmit = async (e) => {
        // prevent browser from refreshing automatically
        e.preventDefault();

        // if any of the fields is empty, make it red by setting error state true
        if (eventName === '') {
            setEventNameError(true);
        }

        if (eventCode === '') {
            setEventCodeError(true);
        }

        if (isOpen === '') {
            setIsOpenError(true);
        }

        if (isOnline === '') {
            setIsOnlineError(true);
        }

        // implement the backend functionality only if all the fields are filled properly
        if (eventName && eventCode && isOpen && isOnline) {

            // actual backend logic goes here
            // on hitting 'create' button, do following on the backend
            // perform following checks
            // 1) Is the event already created by the admin org?
            // IN FUTURE - 2) Does the check-in code already exist?
            // if answer to any of the above is true, then show the user...
            // ... appropriate alert and return from the function

            // check 1 - Is the event already created by the admin org?
            // search events collection for the same event name and if there is one...
            // ...check the createdBy field of that event

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
                    <h2>Create a new event</h2>
                    <h4>It will take less than 2 minutes to fill out the following form and create a new event!</h4>

                    <form noValidate autoComplete="off" className="form">
                        <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventName(e.target.value)} error={eventNameError} fullWidth required label="Event Name" variant="outlined" value={eventName} />
                        <TextField sx={{ marginBottom: 5 }} onChange={(e) => setEventCode(e.target.value)} error={eventCodeError} fullWidth required label="Check-in Code" variant="outlined" value={eventCode} />
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
