import React from 'react'
import SideBar from './SideBar'

function EventsHistory() {
    return (
        <div>
            <SideBar />
            <p>You can view events history here.</p>
            {console.log("I am on history page.")}
        </div>
    )
}

export default EventsHistory
