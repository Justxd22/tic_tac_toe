import React from 'react';

interface StrikeProps {
  strikeClass: string | undefined;
}

const Strike: React.FC<StrikeProps> = ({ strikeClass }) => {
  return <div className={`strike ${strikeClass}`}></div>;
}

export default Strike;

