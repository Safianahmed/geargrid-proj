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
import Contact from "./components/Contact";
import Businesses from "./components/Businesses";
import Membership from "./components/Membership"
import CarBuild from "./components/CarBuild.js";
import EditBuild from "./components/Editbuild.js"; 
import AddBuild from "./components/Addbuild.js";

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
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/home" element={<Home />} />
        <Route path="/car-build/:id" element={<CarBuild />} />
        <Route path="/edit-build/:id" element={<EditBuild />} />
        <Route path="/add-build" element={<AddBuild />} />

      </Routes>
    </Router>
  );
}

export default App;
