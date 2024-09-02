import React from "react";
import { useGameContext } from "./GameProvider";
import GameAlert from "@/components/GameAlert";

function FirstPlay() {
  const { playerId, firstPlayer } = useGameContext();

  return (
    <div>
      {firstPlayer > -1 && (
        <GameAlert
          text="First move"
          isTop={firstPlayer !== playerId}
          subText="(highest bone)"
        />
      )}
    </div>
  );
}

export default FirstPlay;
