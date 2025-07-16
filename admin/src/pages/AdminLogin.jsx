import React, { useState, Navigate } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import "./AdminLogin.css";
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:3002/adminLogin', {username,password})
        .then(result => {console.log(result)
          if(result.data.message === "Success"){
          
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminEmail", result.data.email);
            localStorage.setItem("adminId", result.data.userId); //  Store userId
            navigate('/');
          
          }else{
            alert(result.data.message)
          }
          
        })
        .catch(err => console.log(err))
    }


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
