import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Archive from "./components/Archive";
import Events from "./components/Events"; 
import Header from "./components/Header"; 
import CarBuild from "./components/CarBuild.js";

function App() {
  return (
    <Router>
      <Header /> {/* Header will now appear on all pages */}
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/menu" element={<Navbar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/events" element={<Events />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/car-build" element={<CarBuild />} />
      </Routes>
    </Router>
  );
}

export default App;
