import '../assets/stylesheets/Login.css';
import { FC } from 'react';
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";  
import Logo from '../assets/Images/Text_Logo.png';  

const Login: FC = () => {
  return (
    <>
      <img src={Logo} alt="Logo" className="logo" />
      <div className="wrapper">
        <form>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon"/>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <FaLock className="icon"/>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="#">Register</a></p>
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

export default Login;