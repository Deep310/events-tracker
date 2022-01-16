import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
    return (
        <div className="notfound">
            <h1 style={{ textAlign: 'center' }}>404 - Page Not Found</h1>
            <p>You have landed on a wrong path my friend.</p>
            <p><Link to="/">Home</Link></p>
        </div>
    )
}

export default NotFound
