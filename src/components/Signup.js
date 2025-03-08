import React from "react";
import "../css/styles.css";

const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="brand-name">GearGrid</h1>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
      </div>
      <div className="signup-box">
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default Signup;
