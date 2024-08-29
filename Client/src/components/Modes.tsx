import "../assets/stylesheets/Modes.css";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Images/Text_Logo.png";

const Modes: FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleModeSelect = (path: string) => {
    if (path === "/ttt_multi" && !isLoggedIn) {
      alert("You must be logged in to access this mode.");
      navigate("/login");
    } else {
      // Ensure the path starts with a forward slash for absolute routing
      const absolutePath = path.startsWith("/") ? path : `/${path}`;
      navigate(absolutePath);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/check-session", {
          method: "GET",
          credentials: "include", // Include credentials to check for cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.loggedIn) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          console.log("Not logged in.");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

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
            onChange={() => handleModeSelect("/ttt_multi")}
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
