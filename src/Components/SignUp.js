import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import './SignUp.css'

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [org, setOrg] = useState('');

    const secretUSACSCode = '10020130';

    const auth = useAuth();

    const register = async (e) => {
        // prevent the page from refreshing automatically
        e.preventDefault();

        // password must be at least 6 characters long
        if (password.length < 6) {
            alert('Passwords must be at least 6 characters.');
            return;
        }

        // values of password and confirmPass must be same
        if (password !== confirmPass) {
            alert('Passwords must match!!');
            return;
        }

        // the user must enter his/her org name
        if (org.length === 0) {
            alert('Enter your organization name!');
            return;
        }

        // check if the access code is true or false
        if (accessCode !== secretUSACSCode) {
            console.log("I am inside");
            alert('Incorrect access code. Are you really an eboard member?');
            return;
        }

        // check if the user has already signed up or not
        // run a query in the users collection to compare...
        // ...value of orgName with user inputted org name

        // check for orgName and not email because you can only have...
        // ...one account per organization
        const userRef = collection(db, "users");
        const userExistsCheckQuery = query(userRef, where("orgName", "==", org.toLowerCase()));

        const userExistsCheckQuerySnapshot = await getDocs(userExistsCheckQuery);

        // if we get 0 docs from the query snapshot...
        // ... it means the organization name doesn't exist in users collection...
        // ... which means it is safe to create the account using firebase auth
        if (userExistsCheckQuerySnapshot.docs.length !== 0) {
            alert("The user already exists. Please log in to access your account.");
            return;
        }

        //firebase register account here
        try {
            await auth.signup(email, password, org.toLowerCase());
            console.log("successfully signed up");
            navigate("/dashboard");
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
        setOrg('');

    };

    return (
        <div className="signup">
            <div className="signup_container">
                <h1>Sign up</h1>
                <form id="signupForm" noValidate>
                    <h5>E-mail</h5>
                    <input
                        autoFocus
                        type="email"
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

                    <h5>Organization Name</h5>
                    <input
                        type="text"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                    />

                    <h5>Access Code</h5>
                    <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />
                </form>

                <button disabled={!email || !password || !confirmPass || !accessCode || !org} className="signup_signupButton" onClick={register}>
                    Sign up
                </button>

                <p className="signup_notice">
                    <h3><strong>NOTICE:</strong> You must be an eboard member of your organization
                        to create an account on Trackd.</h3>
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
