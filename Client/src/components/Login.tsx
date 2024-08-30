import React, { FC, useState } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from '../assets/Images/Text_Logo.png';
import '../assets/stylesheets/Login.css';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        // credentials: 'include', // Include credentials to save cookies, only in cross-origin requests
        credentials: 'same-origin', //only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
                // Get the current URL
        const currentUrl = new URL(window.location.href);

        // Get the 'next' parameter
        const nextUrl = currentUrl.searchParams.get('next');

        // Check if 'next' parameter exists and is the same origin
        if (nextUrl) {
            const nextUrlObj = new URL(nextUrl);
            if (nextUrlObj.origin === window.location.origin) {
                // Redirect to the 'next' URL
                window.location.href = nextUrl;
            } else {
                // Redirect to '/tictactoe' if 'next' is not the same origin
                window.location.href = '/';
            }
        } else {
            // Redirect to '/tictactoe' if 'next' does not exist
            window.location.href = '/modes';
        }
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
      <img src={Logo} alt="Logo" className="logo w-[60%] mt-20 md:mt-0 md:w-full" />

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
