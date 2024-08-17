"use client";

import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { ArrowLeft } from "react-feather";
import PlayerDeck from "@/components/PlayerDeck";
import GameBoard from "@/components/GameBoard";
import { GameProvider } from "@/components/GameProvider";
import OpponentDeck from "@/components/OpponentDeck";
import BoneYard from "@/components/BoneYard";


function GamePage() {
  
=======
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft } from "react-feather";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Deck from "../../../../components/Deck";
import TopZLayer from "../../../../components/TopZLayer";
import GameBoard from "../../../../components/GameBoard";
import { useSocket } from "@/components/SocketProvider";
import { decrypt } from "@/utils/decrypt";
import useCreateAPI from "@/utils/api";
import { toast } from "react-toastify";
import { Game, numberPair } from "@/types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { shuffleArray } from "@/utils";

function GamePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { socket } = useSocket();
  const API = useCreateAPI();
  const { user } = useCurrentUser();
  const [game, setGame] = useState<Game | null>(null);
  const { slug } = params;
  const playerId = useMemo(
    () => game?.players.findIndex((player) => player._id === user?._id) ?? -1,
    [game?.players]
  );

  const [isTurn, setIsTurn] = useState(false);
  const [boneyard, setBoneyard] = useState<numberPair[]>([]);
  const [deck, setDeck] = useState<numberPair[]>([]);
  console.log(boneyard, deck, isTurn);

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

      socket.on("boneyard", ({ encryptedBoneyard, choices, turn }) => {
        console.log("gameJoined", encryptedBoneyard);
        // const decryptedBoneyard = decrypt(encryptedBoneyard);
        console.log(encryptedBoneyard);
        encryptedBoneyard && setBoneyard(encryptedBoneyard);
        setDeck(choices.map((i: number) => boneyard[i]));
        setIsTurn(turn === playerId);
      });

      return () => {
        socket.off("gameJoined");
        socket.off("playerReady");
        socket.off("joinGameError");
      };
    }
  }, [socket]);

>>>>>>> aa35167af024ad22624523c8f5e65c64d2685cef
  return (
    <GameProvider>
      <div
        id="game"
        className='bg-dark-blue bg-[url("/game-bg.png")] relative bg-cover justify-center bg-center flex items-end min-w-screen min-h-screen overflow-hidden'
      >
        <div className="bg-main-blue  relative border-[9px] rounded-2xl border-black-15 w-full min-h-[calc(100vh_-_24px)] h-full max-w-[700px]">
          <div className="bg-main-blue rounded-9 w-full h-full"></div>
          <div
            id="current-player"
            className="absolute -bottom-2 bg-[#617187] w-[calc(100%_+_6px)] rounded-t-9 -left-0.5 flex p-2 justify-between items-center z-10"
          >
            <div className="w-[60px] h-[60px]">
              <Image
                src="/default-avatar.png"
                width={60}
                height={60}
                alt="avatar"
                className="rounded-lg"
              />
            </div>

            <PlayerDeck />

            <div className="text-center">
              <p>0</p>
              <p className="text-xs text-[#afb7c1]">points</p>
            </div>
          </div>

          <Link id="back-button" className="pointer-events-auto" href="/">
            <div className="absolute flex items-center justify-center -left-8 top-12 bg-main-orange w-[60px] h-[60px] rounded-9">
              <ArrowLeft size={24} color="#ffffff" />
            </div>
          </Link>

          <div
            id="game-count"
            className="absolute gap-6 pt-7 pb-4 flex items-center justify-center flex-col -right-8 top-12 bg-main-gray w-[60px] rounded-9"
          >
            <Image
              src="/dots.png"
              width="10"
              height="10"
              alt="dots"
              className="h-2.5 w-2.5 mx-auto"
            />
            <p>20</p>
          </div>
          <GameBoard />
          <BoneYard />
        </div>
        <OpponentDeck />
      </div>
    </GameProvider>
  );
}

export default GamePage;
