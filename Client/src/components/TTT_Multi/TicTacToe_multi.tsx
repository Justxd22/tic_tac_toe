import React, { useState, useEffect, useCallback } from "react";
import io from 'socket.io-client';
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
import { switchPlayer } from "./utils";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";

const arr = new Array(DIMENSIONS ** 2).fill(null);
const board = new Board();

interface Props {
  squares?: Array<number | null>;
}
const TicTacToe_multi = ({ squares = arr }: Props) => {
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
  });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState<string | null>(null);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(GAME_MODES.medium);
  const [socket, setSocket] = useState(null);
  const [gameid, setGameid] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:3000', {
      withCredentials: true, // Send cookies with the connection
      // transports: ['websocket'], // Optionally specify transports
    });
    setSocket(newSocket);
    console.log('Socket connection established.');

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join_queue');
      console.log('joined queue waiting.....');

      socket.on('game_id', (data) => {
        console.log('GAME_ID', data);
        setGameid(data);
      });
  
      socket.on('start_game', (data) => {
        console.log('Starting game.....', data);
        setPlayers({ human: data.player, ai: data.player === 1 ? 2 : 1 });
        setGameState(GAME_STATES.inProgress);
        setNextMove(PLAYER_X);
        setGameid(data.game_id);
      });
  
      socket.on('move', (msg) => {
        console.log('SOCKET', msg.index, msg);
        move(msg.index, msg.player);
        setNextMove(msg.player === 1 ? 2 : 1);
      });

      console.log('Event listeners set up.');
  
      return () => {
        socket.off('start_game');
        socket.off('move');
      };
    }
  }, [socket]);


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
      // console.log('MOVE',index);
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

  // useEffect(() => {
  //   if (socket) {
  //     const handleBackendAI = (msg: any) => {
  //       console.log('SOCKET', msg.index, msg);

  //       const index = msg.index;

  //       if (index !== null && !grid[index]) {
  //         if (players.ai !== null) {
  //           move(index, players.ai);
  //         }
  //         setNextMove(players.human);
  //       }
  //     };

  //     socket.on('backendAI', handleBackendAI);

  //     return () => {
  //       socket.off('backendAI', handleBackendAI);
  //     };
  //   }
  // }, [socket, grid, players.ai, players.human, move]);
  /**
   * Make AI move when it's AI's turn
   */
  // useEffect(() => {
  //   if (
  //     nextMove !== null &&
  //     nextMove === players.ai &&
  //     gameState !== GAME_STATES.over
  //   ) {
  //     // AI move will trigger socket move
  //     // No need to call socketMove here; it's handled in the useEffect above
  //   }
  // }, [nextMove, players.ai, gameState]);

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
      console.log('HUMAN', index); // SEND TO SOCKETS // 1 is X,  0 is O
      const data = {
        player: players.human,
        index: index,
        game_id: gameid,
      };
      socket.emit('humanMove', data);

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

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <Inner>
        <p>Select difficulty</p>
        <select onChange={changeMode} value={mode}>
          {Object.keys(GAME_MODES).map((key) => {
            const gameMode = GAME_MODES[key];
            return (
              <option key={gameMode} value={gameMode}>
                {key}
              </option>
            );
          })}
        </select>
      </Inner>
      <Inner>
        <p>Choose your player</p>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
      </Inner>
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
        close={() => setModalOpen(false)}
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

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Strikethrough = styled.div<{ styles: string | null }>`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default TicTacToe_multi;
