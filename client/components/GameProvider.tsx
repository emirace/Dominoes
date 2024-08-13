import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { GameContextType, numberPair, tileType } from "@/types";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTile, setDraggedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [recentlyDroppedTile, setRecentlyDroppedTile] =
    useState<GameContextType["draggedTile"]>(null);

  const [playerDeck, setPlayerDeck] = useState<tileType[]>([]);

  const setTile = (tiles: numberPair[]) =>
    setPlayerDeck((prevTile) => [
      // ...prevTile,
      ...tiles.map((tile) => ({
        id: Number(`${tile[0]}${tile[1]}`),
        tile,
      })),
    ]);
    
  useEffect(() => {setTile([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
  ]);}, [])
  

  return (
    <GameContext.Provider
      value={{
        draggedTile,
        setDraggedTile,
        recentlyDroppedTile,
        setRecentlyDroppedTile,
        playerDeck,
        setPlayerDeck,
        setTile
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
