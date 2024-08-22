import GameState from "./GameState";

interface ResetProps {
  gameState: GameState;
  onReset: () => void;
}

function Reset({ gameState, onReset }: ResetProps): JSX.Element | undefined {
  if (gameState === GameState.inProgress) {
    return;
  }
  return (
    <button onClick={onReset} className="reset-button">
      Play Again
    </button>
  );
}

export default Reset;

