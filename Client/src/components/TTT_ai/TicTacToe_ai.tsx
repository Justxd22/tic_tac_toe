import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMENSIONS,
  GAME_MODES,
} from "./constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "./utils";
import { minimax } from "./minimax";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";
import gameOverSoundAsset from "../../assets/sounds/game_over.wav";
import clickSoundAsset from "../../assets/sounds/click.wav";
import boardImage from "../../assets/Images/board.png";

// Define the shape of userInfo based on your API response
interface UserInfo {
  game_played: number;
  wins: number;
  losses: number;
  draws: number;
  // Add other fields as necessary
}

// Define the type for error
type ErrorType = string | null;

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const arr = new Array(DIMENSIONS ** 2).fill(null);
const board = new Board();

interface Props {
  squares?: Array<number | null>;
}
const TicTacToe_ai = ({ squares = arr }: Props) => {
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
  const [mode, setMode] = useState(GAME_MODES.medium);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<ErrorType>(null);
  console.log(error || "NO errors");
  useEffect(() => {
    // Fetch user profile when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Add other headers if needed, e.g., Authorization
          },
          credentials: "include", // Include credentials if your session management requires it
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserInfo(data);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error.message);
        } else {
          setError("An unknown error occurred");
          console.log("An unknown error occurred");
        }
      }
    };

    fetchUserProfile();
  }, []);

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

  /**
   * Make the AI move. If it's the first move (board is empty),
   * make move at any random cell to skip unnecessary minimax calculations
   */
  const aiMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let index;
    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      // Medium level is basically ~half of the moves are minimax and the other ~half random
      case GAME_MODES.medium:
        const smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.ai!)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.difficult:
      default:
        index = board.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.ai!)[1];
    }

    if (index !== null && !grid[index]) {
      if (players.ai !== null) {
        move(index, players.ai);
      }
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  /**
   * Make AI move when it's AI's turn
   */
  useEffect(() => {
    // @ts-ignore
    let timeout: NodeJS.Timeout;
    if (
      nextMove !== null &&
      nextMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      // Delay AI moves to make them more natural
      timeout = setTimeout(() => {
        aiMove();
      }, 250);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, aiMove, players.ai, gameState]);

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
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

  const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
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

  return gameState === GAME_STATES.notStarted ? (
    <div className="text-white font-newrocker w-full">
      <div className="space-y-4">
        <div className="justify-center text-center">
          <p className="mb-2">Select difficulty</p>
          <select
            onChange={changeMode}
            value={mode}
            className="bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(GAME_MODES).map((key) => {
              const gameMode = GAME_MODES[key];
              return (
                <option
                  key={gameMode}
                  value={gameMode}
                  className="bg-gray-800 text-white"
                >
                  {key}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <p className="mb-2">Choose your player</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => choosePlayer(PLAYER_X)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              X
            </button>
            <p>or</p>
            <button
              onClick={() => choosePlayer(PLAYER_O)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              O
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      {userInfo ? (
        <div className="flex justify-center items-center w-screen">
          <div className="absolute top-[2%] sm:w-[70%] md:w-[35%] py-4 px-10 text-center bg-opacity-50 grid grid-cols-2 gap-4 items-center justify-around bg-slate-700">
            <p className="font-bold text-white text-xl">
              Games Played: {userInfo.game_played}
            </p>
            <p className="font-bold text-white text-xl">
              Wins: {userInfo.wins}
            </p>
            <p className="font-bold text-white text-xl">
              Losses: {userInfo.losses}
            </p>
            <p className="font-bold text-white text-xl">
              Draws: {userInfo.draws}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}

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
    </>
  );
};

const Container = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
  font-family: "ArtNouveauCaps", sans-serif; /* Apply the font here */
  font-weight: bold;
  color: white;
  background-image: url(${boardImage});
  background-size: cover; /* Adjust based on your desired look */
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
  transform: scale(1.5);

  /* Media query for mobile screens */
  @media (max-width: 768px) {
    transform: scale(1);
  }
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

const Strikethrough = styled.div<{ styles: string | null }>`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default TicTacToe_ai;
