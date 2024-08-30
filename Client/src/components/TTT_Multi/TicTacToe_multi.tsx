import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMENSIONS,
} from "./constants";
import Board from "./Board";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";
import gameOverSoundAsset from "../../assets/sounds/game_over.wav";
import clickSoundAsset from "../../assets/sounds/click.wav";
import boardImage from "../../assets/Images/board.png";

interface UserInfo {
  game_played: number;
  wins: number;
  losses: number;
  draws: number;
}

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
interface GameData {
  player: number;
  game_id: string;
}

interface MoveMessage {
  index: number;
  player: number;
}

const TicTacToe_multi = ({ squares = arr }: Props) => {
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
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [gameid, setGameid] = useState<string | null>(null);
  const [reset, setReset] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<ErrorType>(null);
  console.log(error || "NO errors");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
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
  }, [reset]);

  useEffect(() => {
    const newSocket = io("/", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connection established.");
      console.log("Socket ID:", newSocket.id);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("join_queue");
      console.log("joined queue waiting.....");

      socket.on("start_game", (data: GameData) => {
        console.log("Starting game.....", data);
        setPlayers({ human: data.player, ai: data.player === 1 ? 2 : 1 });
        setGameState(GAME_STATES.inProgress);
        setNextMove(PLAYER_X);
        setGameid(data.game_id);
      });

      socket.on("move", (msg: MoveMessage) => {
        console.log("SOCKET", msg.index, msg, msg.player === 1 ? 2 : 1);
        move(msg.index, msg.player);
        setNextMove(msg.player === 1 ? 2 : 1);
      });

      return () => {
        socket.off("start_game");
        socket.off("move");
      };
    }
  }, [socket]);

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
      setTimeout(() => setModalOpen(true), 300);

      // Update user stats
      if (players.human !== null) {
        updateUserStats(winner);
      }
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [gameState, grid, nextMove]);

  const move = useCallback(
    (index: number, player: number | null) => {
      console.log("MOVE", index, player, gameState);
      if (player !== null || gameState === GAME_STATES.inProgress) {
        console.log("MOVE_VALIDDDDD", index, player);
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
      console.log("HUMAN", index);

      const data = {
        player: players.human,
        index: index,
        game_id: gameid,
      };
      if (socket) {
        socket.emit("humanMove", data);
      }
    }
  };

  // const choosePlayer = (option: number) => {
  //   setPlayers({ human: option, ai: switchPlayer(option) });
  //   setGameState(GAME_STATES.inProgress);
  //   setNextMove(PLAYER_X);
  // };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
    setReset(!reset);

    if (socket) {
      socket.emit("join_queue");
      console.log("Rejoining queue...");
    }
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

  // Function to update user stats
  const updateUserStats = async (winner: number) => {
    if (!userInfo) return;

    const isHumanWinner =
      (players.human === PLAYER_X && winner === PLAYER_X) ||
      (players.human === PLAYER_O && winner === PLAYER_O);
    const isDraw = winner === DRAW;

    const updateData = {
      wins: isHumanWinner,
      losses: !isHumanWinner && !isDraw,
      draws: isDraw,
    };
    console.log("New User Status:", updateData);
    try {
      const response = await fetch("/api/user/update_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user stats");
      }

      const data = await response.json();
      setUserInfo(data);
      console.log("User stats updated:", data);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  return gameState === GAME_STATES.notStarted ? (
    <div className="text-white font-newrocker">
      <p>Waiting For Opponent</p>
    </div>
  ) : (
    <>
      {userInfo ? (
        <div className="flex justify-center items-center w-screen">
          <div className="absolute top-[2%] sm:w-[70%] md:w-[35%] py-4 px-10 text-center bg-opacity-50 rounded-full grid grid-cols-2 gap-4 items-center justify-around bg-slate-700">
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
  font-family: "ArtNouveauCaps", sans-serif;
  font-weight: bold;
  color: white;
  background-image: url(${boardImage});
  background-size: cover;
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
  transform: scale(1.5);

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

export default TicTacToe_multi;
