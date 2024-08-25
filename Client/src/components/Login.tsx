import React, { FC, useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";  
import Logo from '../assets/Images/Text_Logo.png';  
import '../assets/stylesheets/Login.css';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/check-session', {
          method: 'GET',
          credentials: 'include', // Include credentials to check for cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.loggedIn) {
            window.location.href = '/tictactoe';
          }
        }
        else {
          console.log("Not logged in.")
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        window.location.href = '/tictactoe';
      } else {
        console.error('Login failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <>
      <img src={Logo} alt="Logo" className="logo" />

      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            <FaLock className="icon" />
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>

      <a href="#" className="back-button">
        <FaArrowLeft className="icon" />
        Back
      </a>
    </>
  );
};

export default Login;