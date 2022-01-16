import React from 'react'
import Home from './Components/Home'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import NotFound from './Components/NotFound'
import Dashboard from './Components/Dashboard'
import { useAuth } from './hooks/useAuth'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// privat route to allow only authenticated users to access it
// using react-router-dom v6
function PrivateOutlet({ children }) {
  const auth = useAuth();
  // console.log(auth);
  console.log(" I am banana");
  return auth.user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <PrivateOutlet>
                <Dashboard />
              </PrivateOutlet>} />
          {/* for any other route, show a 404 error */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
