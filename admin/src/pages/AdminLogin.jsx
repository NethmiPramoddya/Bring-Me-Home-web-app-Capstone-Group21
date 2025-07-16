import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import "./AdminLogin.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Login with", { username, password });

    
    
        if (username === "admin" && password === "admin123") {
          navigate("/");
        } else {
          alert("Invalid username or password");
        }
      
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
