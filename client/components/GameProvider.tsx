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
  PlayerId,
} from "@/types";
import { useSocket } from "./SocketProvider";
import { useParams, useRouter } from "next/navigation";
import useCreateAPI from "@/utils/api";
import useCurrentUser from "@/hooks/useCurrentUser";
import { toast } from "react-toastify";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTile, setDraggedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [recentlyDroppedTile, setRecentlyDroppedTile] =
    useState<GameContextType["draggedTile"]>(null);
  const [game, setGame] = useState<Game | null>(null);
  const { slug } = useParams();
  const router = useRouter();
  const { socket } = useSocket();
  const API = useCreateAPI();
  const { user } = useCurrentUser();
  // console.log(game, user);

  const playerId: PlayerId = useMemo(() => {
    const index = game?.players.findIndex((player) => player._id === user?._id);
    console.log(index);
    return index !== -1 ? (index as PlayerId) : (null as any);
  }, [game, user]);

  const [firstPlayer, setFirstPlayer] = useState(-2);
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

  const [isTurn, setIsTurn] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [boneyard, setBoneyard] = useState<numberPair[]>([]);
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
    if (socket) {
      API.get(`/game/${slug}`)
        .then(({ data }) => {
          // console.log(data);
          if (!data.data || data.data.players.length === 0) {
            return toast.error("Game not found");
          }
          console.log("dataaa", data.data);
          setGame(data.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Game not found");
          setTimeout(() => router.push("/"), 2000);
        });

      socket.on("boneyard", ({ encryptedBoneyard, choices, isTurn }) => {
        if (!boneYardTile.current.length) {
          console.log("gameJoined", encryptedBoneyard);
          // const decryptedBoneyard = decrypt(encryptedBoneyard);
          console.log({ encryptedBoneyard, isTurn, choices, playerId });
          encryptedBoneyard && setBoneyard(encryptedBoneyard);
          const userDeck = choices.map((i: number) => encryptedBoneyard[i]);
          console.log(userDeck, typeof playerId, typeof isTurn);
          boneYardTile.current = makeTile(userDeck);
          setDeck(userDeck);
          setIsTurn(isTurn);
        }
      });

      return () => {
        socket.off("boneyard");
        socket.off("playerReady");
        socket.off("joinGameError");
      };
    }
  }, [socket, playerId]);

  useEffect(() => {
    console.log(boneYardTile.current);
    if (!boneYardTile.current.length) return;

    // setTimeout(() => {
    setDistCallback((arr) => {
      const requestSpec = {
        active: true,
        distribute: true,
        instant: true,
        drawAmount: 7,
        callbacks: arr,
      };
      setBoneYardDistSpec((prevObj) => ({ ...prevObj, ...requestSpec }));

      return arr;
    });
    // }, 0);
  }, [boneYardTile.current, distCallback]);

  return (
    <GameContext.Provider
      value={{
        draggedTile,
        setDraggedTile,
        recentlyDroppedTile,
        setRecentlyDroppedTile,
        selectFromBoneYard,
        deck,
        boneYardDistSpec,
        setBoneYardDistSpec,
        setDeck,
        permits,
        setPermits,
        isTurn,
        registerDistCallback,
        unRegisterDistCallback,
        requestTile,
        playerId,
        firstPlayer,
        setFirstPlayer,
        canPlay: canPlay && isTurn,
        setCanPlay,
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
