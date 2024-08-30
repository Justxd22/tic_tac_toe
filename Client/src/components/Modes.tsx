import "../assets/stylesheets/Modes.css";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Images/Text_Logo.png";

const Modes: FC = () => {
  const navigate = useNavigate();

  const handleModeSelect = (path: string) => {
      const absolutePath = path.startsWith("/") ? path : `/${path}`;
      navigate(absolutePath);
  };

  return (
    <>
      <img src={Logo} alt="Logo" className="modesLogo" />
      <div className="container">
        <div className="radio-wrapper">
          <input
            type="radio"
            id="value-1"
            name="btn"
            className="input"
            onChange={() => handleModeSelect("/tictactoe")}
          />
          <div className="btn">
            <span aria-hidden="true">Local</span>
            <span aria-hidden="true" className="btn__glitch">
              Local
            </span>
            <label className="number">m1</label>
          </div>
        </div>
        <div className="radio-wrapper">
          <input
            type="radio"
            id="value-2"
            name="btn"
            className="input"
            onChange={() => handleModeSelect('/ttt_multi')}
          />
          <div className="btn">
            <span aria-hidden="true">Online</span>
            <span aria-hidden="true" className="btn__glitch">
              Online
            </span>
            <label className="number">m2</label>
          </div>
        </div>
        <div className="radio-wrapper">
          <input
            type="radio"
            id="value-3"
            name="btn"
            className="input"
            onChange={() => handleModeSelect("/ttt_ai")}
          />
          <div className="btn">
            <span aria-hidden="true">AI</span>
            <span aria-hidden="true" className="btn__glitch">
              AI
            </span>
            <label className="number">m3</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modes;
