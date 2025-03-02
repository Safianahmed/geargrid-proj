import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo navigates to Home */}
      <Link to="/" className="navbar-logo">GearGrid</Link>

      {/* Menu button in top-right corner */}
      <Link to="/menu" className="menu-btn">☰</Link>
    </nav>
  );
};

export default Navbar;
