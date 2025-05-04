import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        navigate('/profile');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="brand-name">GearGrid</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="auth-btn">Log In</button>
        </form>
        <p>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
        </p>
      </div>
      <div className="signup-box">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;