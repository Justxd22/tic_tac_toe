import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMENSIONS,
  // GAME_MODES,
} from "./constants";
import Board from "./Board";
import { switchPlayer } from "./utils";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";
import gameOverSoundAsset from "../../assets/sounds/game_over.wav";
import clickSoundAsset from "../../assets/sounds/click.wav";
import boardImage from '../../assets/Images/board.png';
import PulsatingButton from "../ui/pulsating-button";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const arr = new Array(DIMENSIONS ** 2).fill(null);
const board = new Board();

interface Props {
  squares?: Array<number | null>;
}
const TicTacToe_Local = ({ squares = arr }: Props) => {
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
  });
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState<string | null>(null);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * On every move, check if there is a winner. If yes, set game state to over and open result modal
   */
  useEffect(() => {
    const boardWinner = board.getWinner(grid);

    const declareWinner = (winner: number) => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [gameState, grid, nextMove]);

  /**
   * Set the grid square with respective player that made the move. Only make a move when the game is in progress.
   * useCallback is necessary to prevent unnecessary recreation of the function, unless gameState changes, since it is
   * being tracked in useEffect
   * @type {Function}
   */
  const move = useCallback(
    (index: number, player: number | null) => {
      if (player !== null && gameState === GAME_STATES.inProgress) {
        setGrid((grid) => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
    } 
    else if(!grid[index]) {
      move(index, players.ai);
      setNextMove(players.human);
    }
  };

  const choosePlayer = (option: number) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
  };

  useEffect(() => {
    if (nextMove !== null) {
      clickSound.play();
    }
  }, [nextMove]);

  useEffect(() => {
    if (gameState !== GAME_STATES.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  const handleClose = () => {
    setModalOpen(false);
    navigate("/");
  };

  const startGame = () => {
    choosePlayer(1);
  };

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <PulsatingButton
        children="Start"
        onClick={startGame}
        className="font-bold transform transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
      />
    </div>
  ) : (
    <Container dims={DIMENSIONS}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square
            data-testid={`square_${index}`}
            key={index}
            onClick={() => humanMove(index)}
          >
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}
      <Strikethrough
        styles={
          gameState === GAME_STATES.over ? board.getStrikethroughStyles() : ""
        }
      />
      <ResultModal
        isOpen={modalOpen}
        winner={winner}
        close={handleClose}
        startNewGame={startNewGame}
      />
    </Container>
  );
};

const Container = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
  font-family: "WoodCarving", sans-serif; /* Apply the font here */
  font-weight: bold;
  color: white;
  background-image: url(${boardImage});
  background-size: cover; /* Adjust based on your desired look */
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
  transform: scale(1.5);
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};

  &:hover {
    cursor: pointer;
  }
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

// const ButtonRow = styled.div`
//   display: flex;
//   width: 150px;
//   justify-content: space-between;
// `;

// const Inner = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-bottom: 30px;
// `;

const Strikethrough = styled.div<{ styles: string | null }>`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default TicTacToe_Local;