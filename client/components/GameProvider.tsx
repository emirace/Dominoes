import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  GameContextType,
  numberPair,
  tileType,
  boneYardDistSpecType,
} from "@/types";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTile, setDraggedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [recentlyDroppedTile, setRecentlyDroppedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [permits, setPermits] = useState<number[]>([9]);
  const [distCallback, setDistCallback] = useState<
    ((position: numberPair) => tileType | undefined)[]
  >([]);
  const boneYardTile = useRef<tileType[]>([]);
  const [boneYardDistSpec, setBoneYardDistSpec] =
    useState<boneYardDistSpecType>({
      active: false,
      distribute: false,
      instant: false,
      drawAmount: 0,
      required: [],
      callbacks: [],
    });

  const makeTile = (tiles: numberPair[]): tileType[] =>
    tiles.map((tile) => ({
      id: Number(`${tile[0]}${tile[1]}`),
      tile,
    }));

  const selectFromBoneYard = () => {
    const index = Math.floor(Math.random() * boneYardTile.current.length);
    return boneYardTile.current.splice(index, 1)[0];
  };

  const requestTile = (
    instant: boolean,
    callbackID: number,
    required?: number[],
    amount?: number
  ) => {
    setBoneYardDistSpec((prevObj) => ({
      active: true,
      distribute: false,
      instant: instant,
      drawAmount: instant && amount ? amount : 0,
      required: required || null,
      callbacks: [distCallback[callbackID]],
    }));
  };

  const registerDistCallback = (
    callback: (position: numberPair) => tileType | undefined
  ) => {
    setDistCallback((prevArr) => [...prevArr, callback]);
    return distCallback.length;
  };

  const unRegisterDistCallback = (index: number) => {
    setDistCallback((prevArr) => {
      const newList = [...prevArr];
      newList.splice(index, 1);
      return newList;
    });
  };

  useEffect(() => {
    boneYardTile.current = [
      ...makeTile([
        [1, 0],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
      ]),
    ];

    setTimeout(() => {
      setDistCallback((arr) => {
        const requestSpec = {
          active: true,
          distribute: true,
          instant: true,
          drawAmount: 6,
          callbacks: arr,
        };
        setBoneYardDistSpec((prevObj) => ({ ...prevObj, ...requestSpec }));

        return arr;
      });
    }, 0);
  }, []);

  return (
    <GameContext.Provider
      value={{
        draggedTile,
        setDraggedTile,
        recentlyDroppedTile,
        setRecentlyDroppedTile,
        selectFromBoneYard,
        boneYardDistSpec,
        setBoneYardDistSpec,
        permits,
        setPermits,
        registerDistCallback,
        unRegisterDistCallback,
        requestTile,
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
