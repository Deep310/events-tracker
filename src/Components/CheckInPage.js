import React, { useState } from 'react'
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

    const handleMenteeChange = (e) => {
        setIsMentee(e.target.value);
    };

    const handleMentorChange = (e) => {
        setIsMentor(e.target.value);
    };


    const handleSubmit = (e) => {
        // prevent page from refreshing automatically
        e.preventDefault();

        // users with an account on Trackd are not allowed to check-in
        // this makes sure the 2 user bases - attendees and club admins...
        // ... remian separate and do not interact with each other
        // if (auth.user) {
        //     // clear all the fields as well
        //     alert("Registered users can't check-in to the events.");
        //     return;
        // }

        if (name == '') {
            setNameError(true);
        }

        if (orgName == '') {
            setOrgNameError(true);
        }

        if (eventName == '') {
            setEventNameError(true);
        }

        if (code == '') {
            setCodeError(true);
        }

        if (isMentee == '') {
            setIsMenteeError(true);
        }

        if (isMentor == '') {
            setIsMentorError(true);
        }

        if (name && orgName && eventName && code && isMentee && isMentor) {
            console.log(name, orgName, eventName, code, isMentee, isMentor);

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
