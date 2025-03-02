import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  return (
    <div className="menu-page">
      <div className="menu-container">
        <div className="navbar-logo">GearGrid</div>
        <ul className="menu-links">
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/membership">Membership</Link></li>
          <li><Link to="/businesses">Businesses</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
