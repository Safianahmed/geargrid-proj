import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Archive from "./components/Archive";
import Membership from "./components/Membership";
import Events from "./components/Events"; // ✅ Import Events component
import Header from "./components/Header";

import "./styles.css";

function App() {
  return (
    <Router>
      <Header /> {/* Header will now appear on all pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/menu" element={<Navbar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/events" element={<Events />} />  {/* ✅ New route for Events */}
        < Route path="/header" element={<Header />} />
      </Routes>
    </Router>
  );
}

export default App;
