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
  const [draggedTile, setDraggedTile] = useState<tileType | null>(null);
  const recentlyDroppedTile = useRef<tileType | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [opponentPlay, setOpponentPlay] = useState<{
    tilePlayed: tileType;
    playedOn: tileType | null;
  } | null>(null);
  const oppenentPullFrom = useRef<numberPair>([0, 0]);
  const { slug } = useParams();
  const router = useRouter();
  const { socket } = useSocket();
  const API = useCreateAPI();
  const { user } = useCurrentUser();

  const playerId: PlayerId = useMemo(() => {
    const index = game?.players.findIndex((player) => player._id === user?._id);
    return index !== -1 ? (index as PlayerId) : (null as any);
  }, [game, user]);

  const [firstPlayer, setFirstPlayer] = useState(-2);
  const [permits, setPermits] = useState<number[]>([1, 2, 3, 4, 5, 6]);
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
  console.log("is your turn", isTurn);
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
    console.log("un register a callback", index);
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
          if (!data.data || data.data.players.length === 0) {
            return toast.error("Game not found");
          }
          setGame(data.data);
        })
        .catch((err) => {
          toast.error("Game not found");
          setTimeout(() => router.push("/"), 2000);
        });

      socket.on("boneyard", ({ encryptedBoneyard, choices, isTurn, text }) => {
        console.log("boneyard------", text);
        if (!boneYardTile.current.length) {
          encryptedBoneyard && setBoneyard(encryptedBoneyard);
          const userDeck = choices.map((i: number) => encryptedBoneyard[i]);
          boneYardTile.current = makeTile(userDeck);
          setDeck(userDeck);
          setIsTurn(isTurn);
        }
      });

      socket.on("userPlayed", () => setIsTurn(false));

      socket.on(
        "opponentPlayed",
        ({ tile, gameboard, isTurn: isCurrentTurn }) => {
          setIsTurn(isCurrentTurn);

          const playedTile = { id: tile.id, tile: tile.tile } as tileType;
          const temp = gameboard[gameboard.length - 1].tileConnectedTo;
          const playedTileConnectedTo = {
            id: temp?.id,
            tile: temp?.tile,
          } as tileType;

          setOpponentPlay({
            tilePlayed: playedTile,
            playedOn: playedTileConnectedTo.id
              ? playedTileConnectedTo
              : { id: 0, tile: [0, 0] },
          });
        }
      );

      return () => {
        socket.off("boneyard");
        socket.off("opponentPlayed");
        socket.off("userPlayed");
        socket.off("playerReady");
        socket.off("joinGameError");
      };
    }
  }, [socket, playerId]);

  useEffect(() => {
    if (!boneYardTile.current.length) return;

    setDistCallback((arr) => {
      const requestSpec = {
        active: true,
        distribute: true,
        instant: true,
        drawAmount: 7,
        callbacks: arr,
      };
      console.log("array callbacks", arr);
      setBoneYardDistSpec((prevObj) => ({ ...prevObj, ...requestSpec }));

      return arr;
    });
  }, [boneYardTile.current, distCallback]);

  console.log("current distcallback length", distCallback.length);

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
        isTurn,
        setIsTurn,
        registerDistCallback,
        unRegisterDistCallback,
        requestTile,
        playerId,
        firstPlayer,
        setFirstPlayer,
        canPlay: canPlay && isTurn,
        setCanPlay,
        opponentPlay,
        setOpponentPlay,
        oppenentPullFrom,
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
