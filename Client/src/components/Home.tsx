import '../assets/stylesheets/Home.css';
import { FC } from 'react';
import { FaAngleDoubleDown } from "react-icons/fa";  
import Logo from '../assets/Images/Text_Logo.png';  

const Home: FC = () => {
  return (
    <>
      <img src={Logo} alt="Logo" className="homeLogo"/>
      {/* <a href="/tictactoe" className="play-button"> */}
      <a href="/modes" className="play-button">
        <p className='play-text'>PLAY</p>
        <div className="icon-container">
          <FaAngleDoubleDown size={128} color='white' />
        </div>
      </a>
    </>
  );
}

export default Home;