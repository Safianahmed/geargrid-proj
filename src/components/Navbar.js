import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css"; 

const Menu = ({ closeMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="menu-overlay">
      {/* Left Side - Car Image */}
      <div className="menu-image"></div>

      {/* Right Side - Sidebar Menu */}
      <div className="menu-container">
        {}
        <div className="close-icon" onClick={closeMenu}>
        </div>

        {/* Menu Links */}
        <ul className="menu-links">
          {[
            { path: "/login", label: "LOG IN" },
            { path: "/events", label: "EVENTS" },
            { path: "/profile", label: "PROFILE" },
            { path: "/membership", label: "MEMBERSHIP" },
            { path: "/businesses", label: "BUSINESSES" },
            { path: "/contact", label: "CONTACT" },
          ].map((item, index) => (
            <li key={index} onClick={() => navigate(item.path)}>
              <Link to={item.path} className="menu-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
