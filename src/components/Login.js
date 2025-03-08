import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Corrected path to Login.css

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    navigate("/menu");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="brand-name">GearGrid</h1>
        <form>
          <input type="text" placeholder="Phone number, username, or email" required />
          <input type="password" placeholder="Password" required />
          <button type="button" className="auth-btn" onClick={handleLogin}>
            Log in
          </button>
        </form>
        <a href="/forgot-password" className="forgot-password">
          Forgot password?
        </a>
      </div>
      <div className="signup-box">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
