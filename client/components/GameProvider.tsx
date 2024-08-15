import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { GameContextType, numberPair, tileType } from "@/types";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTile, setDraggedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [recentlyDroppedTile, setRecentlyDroppedTile] =
    useState<GameContextType["draggedTile"]>(null);

  const [playerDeck, setPlayerDeck] = useState<tileType[]>([]);
  const [permits, setPermits] = useState<number[]>([9]);
  const [boneYardTile, setBoneYardTile] = useState<tileType[]>([]);
  const [activateBoneYard, setActivateBoneYard] = useState<boolean>(false);
  const drawFromBoneYardClb = useRef<((position: numberPair) => void) | null>(
    null
  );

  const makeTile = (tiles: numberPair[]): tileType[] =>
    tiles.map((tile) => ({
      id: Number(`${tile[0]}${tile[1]}`),
      tile,
    }));

  const selectFromBoneYard = () => {
    console.log('prevList', boneYardTile);
    const index = Math.floor(Math.random() * boneYardTile.length);
    let result;
    setBoneYardTile((prevList) => {
     result = prevList.splice(index, 1);
      return [...prevList];
    });
    return result
  };

  const requestTile = (callback: (position: numberPair) => void) => {
    setActivateBoneYard(true);
    drawFromBoneYardClb.current = callback;
  };

  useEffect(() => {
    setPlayerDeck([
      ...makeTile([
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
      ]),
    ]);

    setBoneYardTile([
      ...makeTile([
        [1, 0],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
      ]),
    ]);
  }, []);

  return (
    <GameContext.Provider
      value={{
        draggedTile,
        setDraggedTile,
        recentlyDroppedTile,
        setRecentlyDroppedTile,
        playerDeck,
        setPlayerDeck,
        selectFromBoneYard,
        activateBoneYard,
        setActivateBoneYard,
        drawFromBoneYardClb,
        requestTile,
        permits,
        setPermits,
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
