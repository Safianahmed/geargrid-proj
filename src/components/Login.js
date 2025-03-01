import React from "react";
import "../styles.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="brand-name">GearGrid</h1>
        <form>
          <input type="text" placeholder="Phone number, username, or email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="auth-btn">Log In</button>
        </form>
        <p className="forgot-password"><a href="/forgot-password">Forgot password?</a></p>
      </div>
      <div className="signup-box">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
