import '../assets/stylesheets/Login.css';
import { FC } from 'react';
import { FaAngleDoubleDown } from "react-icons/fa";  
import Logo from '../assets/Images/Text_Logo.png';  

const Home: FC = () => {
  

  return (
    <>
      <img src={Logo} alt="Logo" className="logo" />
      <div className="wrapper">
        
      </div>
      <a href="/tictactoe" className="back-button">
       <FaAngleDoubleDown size={128} color='white' />
        <p className='text-center text-white'>Play Now</p>
      </a>
    </>
  );
}

export default Home;