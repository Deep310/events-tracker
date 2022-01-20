import React from 'react'
import SideBar from './SideBar'
import Box from '@mui/material/Box'
import './EventsHistory.css'

function EventsHistory() {
    return (
        <div className="eventhistory-container">
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <SideBar />
                <div className="eventhistory">
                    <p>You can view events history here.</p>
                    {console.log("I am on history page.")}
                </div>
            </Box>
        </div>
    )
}

export default EventsHistory
