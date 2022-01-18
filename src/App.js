import React from 'react'
import Home from './Components/Home'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import NotFound from './Components/NotFound'
import Dashboard from './Components/Dashboard'
import NewEventPage from './Components/NewEventPage'
import EventsHistory from './Components/EventsHistory'
import CheckInPage from './Components/CheckInPage'
import { useAuth } from './hooks/useAuth'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { createTheme, ThemeProvider } from '@mui/material/styles';

// edit the default material ui theme to change font from Roboto to Quicksand
const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand',
  }
})

// private route to allow only authenticated users to access it
// using react-router-dom v6
function PrivateOutlet({ children }) {
  const auth = useAuth();
  // console.log(auth);
  console.log(" I am banana");
  return auth.user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<CheckInPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateOutlet>
                  <Dashboard />
                </PrivateOutlet>}
            />
            <Route
              path="/new-event"
              element={
                <PrivateOutlet>
                  <NewEventPage />
                </PrivateOutlet>}
            />
            <Route
              path="/events-history"
              element={
                <PrivateOutlet>
                  <EventsHistory />
                </PrivateOutlet>}
            />
            <Route path="/" element={<Home />} />
            {/* for any other route, show a 404 error */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
