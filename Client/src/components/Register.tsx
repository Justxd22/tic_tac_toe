import '../assets/stylesheets/Login.css';
import { FC, useState } from 'react';
import { FaEnvelope, FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from '../assets/Images/Text_Logo.png';

const Register: FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the Register request to the backend
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
        // credentials: 'include', // Include credentials to save cookies, only in cross-origin requests
        credentials: 'same-origin',// only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful Register (e.g., redirect or store tokens)
        console.log('Register successful:', data);
        window.location.href = '/login';
      } else {
        // Handle Register error
        console.error('Register failed:', data.message);
        alert(`Register failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error occurred during Register:', error);
    }
  };

  return (
    <>
      <img src={Logo} alt="Logo" className="logo w-[60%] mt-20 md:mt-0 md:w-full" />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon"/>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon"/>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon"/>
          </div>
          <button type="submit">Sign up</button>
          <div className="register-link">
            <p>Have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>
      <a href="#" className="back-button">
        <FaArrowLeft className="icon" />
        Back
      </a>
    </>
  );
}

export default Register;
