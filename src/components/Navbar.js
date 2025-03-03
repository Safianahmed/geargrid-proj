import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <div className="menu-container">
        {/* GearGrid Circle Button - Navigates to Home */}
        <div 
          className="navbar-logo" 
          onClick={() => navigate("/")} 
          role="button" 
          tabIndex={0}
        >
          GearGrid
        </div>

        <ul className="menu-links">
          <li><a href="/login">Log In</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/membership">Membership</a></li>
          <li><a href="/businesses">Businesses</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
