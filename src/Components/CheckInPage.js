import React from 'react'
import { useAuth } from '../hooks/useAuth'

// Event participants will use this page to check-in to the events
// They will most likely use their phones to enter the code and check-in
// hence, this page has to be responsive on mobile
// develop the UI with a mobile-first approach
function CheckInPage() {
    const auth = useAuth();

    return (
        <div>
            {auth.user ? <p>hi</p> : <p>bye</p>}
            <p>Welcome, user</p>
        </div>
    )
}

export default CheckInPage
