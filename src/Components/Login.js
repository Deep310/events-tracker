import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const loginWithFirebase = async (e) => {
        // prevent the page from refreshing automatically
        e.preventDefault();

        //log in to account here
        try {
            await auth.login(email, password);
            console.log("I am signed in yay");

            navigate("/dashboard");
        }
        catch (error) {
            console.error(error);
            alert(error.message);
        };

        // after successfully logging the user in with firebase auth,
        // clear all the form fields
        setEmail('');
        setPassword('');

    };

    return (
        <div className="login">
            <div className="login_container">
                <div className="login_containerTitle">
                    <h1>Welcome Back</h1>
                    <h5>Enter your credentials to access your account</h5>
                </div>
                <form id="loginForm" noValidate>
                    <h5>E-mail</h5>
                    <input
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h5>Password</h5>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </form>

                <button disabled={!email || !password} className="login_loginButton" onClick={loginWithFirebase}>
                    Sign in
                </button>

                <p className="login_notice">
                    <h3><strong>NOTICE:</strong> Please only sign in if you are an eboard member
                        of an authorized Rutgers student club.</h3>
                </p>

                <div className="login_login">
                    <h4>Don't have an account?</h4>
                    <h4><Link to="/signup">Sign up</Link></h4>
                </div>

            </div>
        </div>
    );
}

export default Login
