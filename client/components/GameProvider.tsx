import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  GameContextType,
  numberPair,
  tileType,
  boneYardDistSpecType,
  Game,
} from "@/types";
import { useSocket } from "./SocketProvider";
import { useParams, useRouter } from "next/navigation";
import useCreateAPI from "@/utils/api";
import useCurrentUser from "@/hooks/useCurrentUser";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTile, setDraggedTile] = useState<tileType | null>(null);
  const recentlyDroppedTile = useRef<tileType | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const { slug } = useParams();
  const router = useRouter();
  const { socket } = useSocket();
  const API = useCreateAPI();
  const { user } = useCurrentUser();
  const playerId = useMemo(
    () => game?.players.findIndex((player) => player._id === user?._id) ?? -1,
    [game?.players]
  );
  const [permits, setPermits] = useState<number[]>([1,2,3,4,5,6]);
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

  // const [isTurn, setIsTurn] = useState(false);
  // const [boneyard, setBoneyard] = useState<numberPair[]>([]);
  const [deck, setDeck] = useState<numberPair[]>([]);

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
    // if (socket) {
    //   API.get(`/game/${slug}`)
    //     .then(({ data }) => {
    //       // console.log(data);
    //       if (!data.data || data.data.players.length === 0) {
    //         return toast.error("Game not found");
    //       }
    //       // console.log("dataaa", data.data);
    //       setGame(data.data);
    //     })
    //     .catch((err) => {
    //       // console.log(err);
    //       toast.error("Game not found");
    //       setTimeout(() => router.push("/"), 2000);
    //     });
    //   socket.on("boneyard", ({ encryptedBoneyard, choices, turn }) => {
    //     if (!boneYardTile.current.length) {
    //       encryptedBoneyard && setBoneyard(encryptedBoneyard);
    //       const userDeck = choices.map((i: number) => encryptedBoneyard[i]);
    //       console.log("userDeck", userDeck);
    //       boneYardTile.current = makeTile(userDeck);
    //       // console.log("boneYardTile.current", boneYardTile.current);
    //       setDeck(userDeck);
    //       setIsTurn(turn === playerId);
    //     }
    //   });
    //   return () => {
    //     socket.off("boneyard");
    //     socket.off("playerReady");
    //     socket.off("joinGameError");
    //   };
    // }
  }, [socket]);

  useEffect(() => {
    boneYardTile.current = makeTile([
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
      [6, 6],
      [5, 1],
    ]);
  }, []);

  useEffect(() => {
    if (boneYardTile.current.length && distCallback.length === 2) {
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
    }
  }, [boneYardTile.current, distCallback]);

  return (
    <GameContext.Provider
      value={{
        draggedTile,
        setDraggedTile,
        recentlyDroppedTile,
        selectFromBoneYard,
        deck,
        boneYardDistSpec,
        setBoneYardDistSpec,
        setDeck,
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
