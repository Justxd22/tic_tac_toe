import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicTacToe from "./components/Game/TicTacToe";
import Login from "./components/Login";
import "./App.css";
import "tailwindcss/base.css"
import "tailwindcss/components.css"
import "tailwindcss/utilities.css"



function App() {
  return (
    <Router>
    <div className="flex flex-col items-center justify-center min-h-screen flex-1">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
