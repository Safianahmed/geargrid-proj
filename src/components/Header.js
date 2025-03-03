import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "../Header.css"; // Import CSS for styling

const Header = () => {
  const navigate = useNavigate(); // React Router navigation function

  return (
    <header className="header">
      {/* Clickable Logo - Navigates to Home */}
      <img
        src="/logo-transparent.png"
        alt="Logo"
        className="header-logo"
        onClick={() => navigate("/home")} // Navigate to Home
        style={{ cursor: "pointer" }} // Make it look clickable
      />

      {/* Clickable Three-line Menu - Navigates to Menu Page */}
      <div className="menu-icon" onClick={() => navigate("/menu")}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </header>
  );
};

export default Header;
