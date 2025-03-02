import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="brand-name">GearGrid</h1>
        <form>
          <input type="text" placeholder="Phone number, username, or email" required />
          <input type="password" placeholder="Password" required />
          <button type="button" className="auth-btn" onClick={() => navigate("/menu")}>
            Log In
          </button>
        </form>
        <p>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
        </p>
      </div>
      <div className="auth-box signup-box">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
