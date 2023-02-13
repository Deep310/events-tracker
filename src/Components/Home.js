import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import img from '../landing-page-picture.png'

function Home() {

    const navigate = useNavigate();

    // edit tab title on component mount
    useEffect(() => {
        document.title = "Trackd - Attendance Tracking Made Easier!";
    }, []);

    return (
        <>
            <NavBar />
            <div className="home">
                <section className="home-landingSection">
                    <div className="home-landingText">
                        <h1>Attendance tracking made easier for student clubs at Rutgers</h1>
                        <h5>Trackd brings together everything you need to track
                            and manage attendace in your events in an easy and efficient way.</h5>
                        <div className="home-interestBtn">
                            <Button
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'black',
                                    },
                                    marginBottom: 5,
                                    backgroundColor: '#007C89',
                                }}
                                onClick={() => navigate("/#about")}
                                type="submit"
                                variant="contained"
                                disableElevation
                                size="large"
                            >
                                <h4 style={{ margin: 0, letterSpacing: '1px' }}>Show Me More!</h4>
                            </Button>
                        </div>
                    </div>
                    <figure className="home-landingImg">
                        <img src={img} alt="landing page illustration" />
                    </figure>

                </section>

                <section className="home-checkIn">
                    <h1>Are you here to check-in to an event?</h1>
                    <Button
                        sx={{
                            '&:hover': {
                                backgroundColor: 'black',
                            },
                            marginBottom: 5,
                            backgroundColor: '#007C89',
                        }}
                        onClick={() => navigate("/check-in")}
                        type="submit"
                        variant="contained"
                        disableElevation
                        size="large"
                    >
                        <h4 style={{ margin: 0, letterSpacing: '1px' }}>Visit This Page</h4>
                    </Button>
                </section>

                {/* <section className="home-about">
                    <h1>hi</h1>
                </section> */}
            </div>
        </>
    )
}

export default Home
