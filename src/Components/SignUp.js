import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import './SignUp.css'

function SignUp() {
    // const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const secretCode = process.env.REACT_APP_SECRET_USACS_ACCESS_CODE;

    const register = (e) => {
        // prevent the page from refreshing automatically
        e.preventDefault();

        if (password.length < 6) {
            alert('Passwords must be at least 6 characters.');
            return;
        }

        if (password !== confirmPass) {
            alert('Passwords must match!!');
            return;
        }

        if (accessCode !== secretCode) {
            alert('Incorrect access code. Are you really a USACS eboard member?');
            return;
        }
        //firebase register account here
        try {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // successfully created user with email and password
                    // returns an object with all the user credentials

                    // console.log("i am new user");
                    const uid = userCredential['user'].uid;
                    // console.log(uid);
                    const data = {
                        events: 0,
                        timestamp: serverTimestamp()
                    };

                    const newDoc = doc(db, "users", uid);
                    setDoc(newDoc, data);

                });

            //console.log("Document written with ID: ", docRef.id);
        }
        catch (error) {
            console.error(error);
            alert(error.message);
        };


        // after successfully registering the user with firebase auth,
        // clear all the form fields
        setEmail('');
        setPassword('');
        setConfirmPass('');
        setAccessCode('');

    };

    return (
        <div className="signup">
            <div className="signup_container">
                <h1>Sign up</h1>
                <form id="signupForm" noValidate>
                    <h5>E-mail</h5>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <h5>Password</h5>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                    />

                    <h5>Re-enter Password</h5>
                    <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />

                    <h5>Access Code</h5>
                    <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />
                </form>

                <button disabled={!email || !password || !confirmPass && !accessCode} className="signup_signupButton" onClick={register}>
                    Sign up
                </button>

                <p className="signup_notice">
                    <h3><strong>NOTICE:</strong> Please only create an account if you are an eboard member
                        of Rutgers USACS and if you are, use the official gmail as email address.</h3>
                </p>

                <div className="signup_login">
                    <h4>Already have an account?</h4>
                    <h4><Link to="/login">Log in</Link></h4>
                </div>

            </div>
        </div>
    );
}

export default SignUp
