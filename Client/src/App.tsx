import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicTacToe from "./components/Game/TicTacToe";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import "tailwindcss/base.css"
import "tailwindcss/components.css"
import "tailwindcss/utilities.css"
import Home from "./components/Home";
import TicTacToe_ai from "./components/TTT_ai/TicTacToe_ai";
import TicTacToe_multi from "./components/TTT_Multi/TicTacToe_multi";



function App() {
  return (
    <Router>
    <div className="flex flex-col items-center justify-center min-h-screen flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/ttt_ai" element={<TicTacToe_ai />} />
        <Route path="/ttt_multi" element={<TicTacToe_multi />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
