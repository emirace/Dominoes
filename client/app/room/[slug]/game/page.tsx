"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "react-feather";
import Deck from "@/components/Deck";
import GameBoard from "@/components/GameBoard";
import { GameProvider } from "@/components/GameProvider";

function GamePage() {
  return (
    <GameProvider>
      <div
        id="game"
        className='bg-dark-blue bg-[url("/game-bg.png")] relative bg-cover justify-center bg-center flex items-end min-w-screen min-h-screen'
      >
        <div className="bg-main-blue  relative border-[9px] rounded-2xl border-black-15 w-full min-h-[calc(100vh_-_24px)] h-full max-w-[700px]">
          <div className="bg-main-blue rounded-9 w-full h-full"></div>
          <div
            id="current-player"
            className="absolute -bottom-2 bg-[#617187] w-[calc(100%_+_6px)] rounded-t-9 -left-0.5 flex p-2 justify-between items-center"
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

            <Deck />

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
        </div>
        <div
          id="other-player"
          className="absolute gap-2 top-0 bg-main-gray w-[260px] rounded-b-9 flex p-2 items-center"
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
          <div className="relative flex justify-center self-start items-center">
            <div
              className="tile absolute top-0 left-2"
              style={{
                transform: "translate(0, 0px) rotate(0deg)",
                backgroundPosition: "-40px -280px",
                width: "30px",
                height: "60px",
                backgroundSize: "280px",
                zIndex: 100,
              }}
            ></div>
            <div
              className="tile absolute top-0 left-2"
              style={{
                transform: "translate(20px, 0px) rotate(0deg)",
                backgroundPosition: "-40px -280px",
                width: "30px",
                height: "60px",
                zIndex: 99,
                backgroundSize: "280px",
              }}
            ></div>
          </div>
          <div className="text-center ml-auto">
            <p>0</p>
            <p className="text-xs text-[#afb7c1]">points</p>
          </div>
        </div>
        {/* <TopZLayer /> */}
      </div>
    </GameProvider>
  );
}

export default GamePage;
