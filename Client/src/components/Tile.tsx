import { FC } from 'react';

interface TileProps {
  className?: string;
  value?: string | null;
  onClick: () => void;
  playerTurn?: string;
}

const Tile: FC<TileProps> = ({ className, value, onClick, playerTurn }) => {
  let hoverClass: string | null = null;
  if (value == null && playerTurn != null) {
    hoverClass = `${playerTurn ? 'true' : 'false'}-hover`; // Example for handling boolean
  }
  return (
    <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
      {value}
    </div>
  );
}

export default Tile;

