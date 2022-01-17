import React from 'react'
import { useAuth } from '../hooks/useAuth'
import SideBar from './SideBar'

function NewEventPage() {
    const auth = useAuth();
    return (
        <div>
            <SideBar />
            <p>Create a new event</p>
            {console.log("I am on new events page.")}
        </div>
    )
}

export default NewEventPage
