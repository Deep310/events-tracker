import React from 'react'
import { useAuth } from '../hooks/useAuth'
import SideBar from './SideBar'
import Box from '@mui/material/Box'
import './NewEventPage.css'

function NewEventPage() {
    const auth = useAuth();
    return (
        <div className="newevent-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />

                <div className="newevent">
                    <p>Create a new event</p>
                    {console.log("I am on new events page.")}
                </div>
            </Box>
        </div>
    )
}

export default NewEventPage
