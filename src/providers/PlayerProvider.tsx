import React, { useState, useEffect } from "react";
import { Player, PlayerContext } from "../contexts/PlayerContext";

const PlayerProvider: React.FC = ({ children }) => {
  const [player, setPlayer] = useState<Player>({
    connected: false,
    name: "",
    health: null,
  });

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;