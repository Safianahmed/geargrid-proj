import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

// component for the website's footer
const Footer = () => {
  return (
    <footer className="gg-footer">  {/* main footer container */}
      <div className="footer-main"> {/* top section of footer */}

        {/* brand logo on the left side */}
        <div className="footer-brand">
          <img src="/logo-transparent.png" alt="GearGrid Logo" />
        </div>

        {/* group of footer columns */}
        <div className="footer-columns">
          {/* company links */}
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
          </div>

          {/* services */}
          <div className="footer-column">
            <h4>Services</h4>
            <Link to="/businesses">Find a Business</Link>
            <Link to="/events">Events</Link>
            <Link to="/register">Register Event</Link>
          </div>

          {/* account Links */}
          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </div>
      </div>

      {/* bottom section of footer */}
      <div className="footer-bottom">
        {/* social media icons */}
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
        </div>

        {/* copyright notice with current year */}
        <p>&copy; {new Date().getFullYear()} GearGrid. All rights reserved.</p>

        {/* legal links */}
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
