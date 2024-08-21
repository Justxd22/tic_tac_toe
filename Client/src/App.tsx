import "./App.css";
import TicTacToe from "./components/TicTacToe";
import "tailwindcss/base.css"
import "tailwindcss/components.css"
import "tailwindcss/utilities.css"


function App() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen flex-1">
        <TicTacToe />
      </div>
  );
}

export default App;
