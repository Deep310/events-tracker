import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './NavBar.css'

function NavBar() {
    const auth = useAuth();

    return (
        <header className="header">
            <a href="." className="logo">Trackable </a>
            <input className="menu-btn" type="checkbox" id="menu-btn" />
            <label className="menu-icon" for="menu-btn"><span className="navicon"></span></label>
            <ul className="menu">
                {auth.user &&
                    <li><Link to="/">Home</Link></li>
                }
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact Us</a></li>

                {/* if the user is signed in, show sign out button...
                ... else, show sign up and login buttons */}
                {auth.user &&
                    <>
                        <li className="signout_button" onClick={() => auth.logout()}>Sign out</li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </>
                }
                {!auth.user && (
                    <>
                        <li><Link to='/signup'>Sign Up</Link></li>
                        <li><Link to='/login'>Login</Link></li>
                    </>
                )}

            </ul>
        </header>
    )
}

export default NavBar
