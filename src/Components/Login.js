import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import './Login.css'

function Login() {
    // const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
        //if (user) navigate('/', { replace: true });
    }, [user]);

    const loginWithFirebase = (e) => {
        // prevent the page from refreshing automatically
        e.preventDefault();

        //log in to account here
        try {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // successfully created user with email and password
                    // returns an object with all the user credentials

                    return
                    console.log(userCredential.user);
                    console.log("i am logged in user");

                })
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
                        type="text"
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
                        of Rutgers USACS.</h3>
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
