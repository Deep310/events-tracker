import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './NavBar.css'
import logo from '../bg.png'

function NavBar() {
    const auth = useAuth();

    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Trackd Logo" />
                <span className="logo-title">Trackd</span>
            </div>
            <input className="menu-btn" type="checkbox" id="menu-btn" />
            <label className="menu-icon" for="menu-btn"><span className="navicon"></span></label>
            <ul className="menu">
                {auth.user &&
                    <li><Link to="/">Home</Link></li>
                }
                <li><Link to="/#about">About</Link></li>
                <li><Link to="/#contact">Contact Us</Link></li>

                {/* if the user is signed in, show sign out button...
                ... else, show sign up and login buttons */}
                {auth.user &&
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li onClick={() => auth.logout()}><Link to="/">Sign out</Link></li>
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
