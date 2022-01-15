import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
    return (
        <header className="header">
            <a href="." className="logo">Trackable </a>
            <input className="menu-btn" type="checkbox" id="menu-btn" />
            <label className="menu-icon" for="menu-btn"><span className="navicon"></span></label>
            <ul className="menu">
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <Link to="/login">
                    <li><a href=".">SIGN IN</a></li>
                </Link>
            </ul>
        </header>
    )
}

export default NavBar
