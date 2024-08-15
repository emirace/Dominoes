import React from "react";
import Image from "next/image";
import { useGameContext } from "./GameProvider";

function OpponentDeck() {
  const { opponentDeckRef } = useGameContext();
  return (
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
      <div
        ref={opponentDeckRef}
        className="relative flex-1 justify-cente self-start items-center w-ful h-10"
      >
        {/* <div
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
        ></div> */}
      </div>
      <div className="text-center ml-auto">
        <p>0</p>
        <p className="text-xs text-[#afb7c1]">points</p>
      </div>
    </div>
  );
}

export default OpponentDeck;
