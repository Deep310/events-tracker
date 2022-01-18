import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import logo from '../bg.png';

const drawerWidth = 240;

// add custom styling to material ui components
const useStyles = makeStyles({
    icon: {
        color: '#000'
    },

    topItem: {
        marginBottom: '30px',
        paddingLeft: '30px'
    },

    logo: {
        color: '#fff'
    }
})

export default function SideBar() {

    const classes = useStyles();
    const navigate = useNavigate();
    const auth = useAuth();

    const handleClick = (e) => {
        e.preventDefault();

        console.log(e.target);
        switch (e.target.innerText) {
            case 'Dashboard':
                navigate("/dashboard");
                break;
            case 'New Event':
                navigate("/new-event");
                break;
            case 'Events History':
                navigate("/events-history");
                break;
            default:
                navigate("/");
        }
    }

    return (
        <Box
            sx={{
                display: 'flex'
            }}
        >
            {/* Side Drawer */}
            <Drawer
                sx={{
                    '& .MuiDrawer-paper': {
                        color: '#000',
                        backgroundColor: '#fff',
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant='permanent'
                anchor='left'
            >
                <div>
                    <List>
                        <ListItem
                            className={classes.topItem}
                        >
                            <IconButton>
                                <img src={logo} alt='Trackd logo' />
                            </IconButton>
                            <ListItemText>Trackd</ListItemText>
                        </ListItem>

                        <ListItemButton>
                            <ListItem>
                                <IconButton
                                    onClick={() => { navigate("/dashboard") }}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            paddingRight: 2,
                                        },
                                    }}
                                >
                                    <GridViewOutlinedIcon />
                                </IconButton>
                                <ListItemText onClick={(e) => handleClick(e)}>Dashboard</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton>
                            <ListItem>
                                <IconButton
                                    onClick={() => { navigate("/new-event") }}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            paddingRight: 2,
                                        },
                                    }}
                                >
                                    <AddBoxOutlinedIcon />
                                </IconButton>
                                <ListItemText onClick={(e) => handleClick(e)}>New Event</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton>
                            <ListItem>
                                <IconButton
                                    onClick={() => { navigate("/events-history") }}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            paddingRight: 2,
                                        },
                                    }}
                                >
                                    <HistoryToggleOffOutlinedIcon />
                                </IconButton>
                                <ListItemText onClick={(e) => handleClick(e)}>Events History</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton>
                            <ListItem>
                                <IconButton
                                    onClick={() => { navigate("/") }}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            paddingRight: 2,
                                        },
                                    }}
                                >
                                    <HomeOutlinedIcon />
                                </IconButton>
                                <ListItemText onClick={(e) => handleClick(e)}>Home</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton>
                            <ListItem>
                                <IconButton
                                    onClick={() => auth.logout()}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            paddingRight: 2,
                                        },
                                    }}
                                >
                                    <LogoutOutlinedIcon />
                                </IconButton>
                                <ListItemText onClick={() => auth.logout()}>Sign Out</ListItemText>
                            </ListItem>
                        </ListItemButton>
                    </List>
                </div>
            </Drawer>
        </Box>
    );
}
