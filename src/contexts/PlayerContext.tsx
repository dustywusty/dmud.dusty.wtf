import { createContext } from "react";

export interface Player {
  connected: boolean;
  name: string;
  health: number | null;
}

export const PlayerContext = createContext<{ player: Player; setPlayer: React.Dispatch<React.SetStateAction<Player>>, handleNameInput: (name: string) => void } | null>(null);