import React, { useEffect } from 'react'
import NavBar from './NavBar'

function Home() {

    // edit tab title on component mount
    useEffect(() => {
        document.title = "Trackd - Home";
    }, []);

    return (
        <>
            <NavBar />
            <div className="home">
                <p>I am home</p>
            </div>
        </>
    )
}

export default Home
