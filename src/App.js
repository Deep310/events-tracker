import React from 'react'
import NavBar from './Components/NavBar'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<NavBar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
